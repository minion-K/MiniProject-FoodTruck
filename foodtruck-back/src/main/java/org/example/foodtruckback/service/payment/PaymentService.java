package org.example.foodtruckback.service.payment;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.common.enums.PaymentMethod;
import org.example.foodtruckback.common.enums.PaymentStatus;
import org.example.foodtruckback.common.enums.RefundStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.payment.request.PaymentApproveRequestDto;
import org.example.foodtruckback.dto.payment.request.PaymentCreateRequestDto;
import org.example.foodtruckback.dto.payment.request.PaymentRefundRequestDto;
import org.example.foodtruckback.dto.payment.response.PaymentResponseDto;
import org.example.foodtruckback.entity.payment.Payment;
import org.example.foodtruckback.entity.payment.PaymentRefund;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.exception.BusinessException;
import org.example.foodtruckback.repository.payment.PaymentRefundRepository;
import org.example.foodtruckback.repository.payment.PaymentRepository;
import org.example.foodtruckback.repository.user.UserRepository;
import org.example.foodtruckback.security.user.UserPrincipal;
import org.example.foodtruckback.service.payment.gateway.PaymentGateway;
import org.example.foodtruckback.service.payment.gateway.PaymentGatewayResolver;
import org.example.foodtruckback.service.payment.gateway.PaymentResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final PaymentRefundRepository paymentRefundRepository;
    private final PaymentGatewayResolver gatewayResolver;
    private final UserRepository userRepository;

    private User getUser(UserPrincipal principal) {
        Long userId = principal.getId();

        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }

    @Transactional
    public ResponseDto<?> createPayment(
            UserPrincipal principal,
            PaymentCreateRequestDto request
    ) {
        User user = getUser(principal);

        return switch(request.method()) {
            case MOCK -> ResponseDto.success(processMockPayment(user, request));
            case TOSS_PAY -> throw new BusinessException(ErrorCode.INVALID_INPUT);
        };
    }

    private PaymentResponseDto processMockPayment(User user, PaymentCreateRequestDto request) {
        Payment payment = Payment.builder()
                .user(user)
                .orderId("ORD_" + UUID.randomUUID())
                .paymentKey("MOCK-" + UUID.randomUUID())
                .amount(request.amount())
                .method(PaymentMethod.MOCK)
                .status(PaymentStatus.READY)
                .productCode(request.productCode())
                .productName(request.productName())
                .build();

        payment.markSuccess();
        paymentRepository.save(payment);

        return toDto(payment);
    }

    @Transactional
    public ResponseDto<PaymentResponseDto> approvePayment(
            UserPrincipal principal,
            PaymentApproveRequestDto request
    ) {
        User user = getUser(principal);

        PaymentGateway gateway = gatewayResolver.resolve(request.method());
        PaymentResult result = gateway.approve(request, principal.getId().toString());

        Payment payment = Payment.builder()
                .user(user)
                .orderId(request.orderId())
                .paymentKey(result.paymentKey())
                .amount(request.amount())
                .method(request.method())
                .status(PaymentStatus.READY)
                .productCode(request.productCode())
                .productName(request.productName())
                .failureCode(result.failureCode())
                .failureMessage(result.failureMessage())
                .build();

        if(result.success()) {
            payment.markSuccess();
        } else {
            payment.markFailed(result.failureCode(), result.failureMessage());
        }

        paymentRepository.save(payment);

        return ResponseDto.success(toDto(payment));
    }

    @Transactional(readOnly = true)
    public ResponseDto<List<PaymentResponseDto>> getMyPayments(UserPrincipal principal) {
        User user = getUser(principal);

        List<Payment> payments = paymentRepository.findByUserOrderByCreatedAtDesc(user);

        List<PaymentResponseDto> response = payments.stream()
                .map(PaymentResponseDto::from)
                .toList();

        return ResponseDto.success(response);
    }

    @Transactional
    public ResponseDto<Void> refundPayment(
            UserPrincipal principal,
            Long paymentId,
            PaymentRefundRequestDto request
    ) {
        User user = getUser(principal);

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PAYMENT_NOT_FOUND));

        if(!payment.getUser().getId().equals(user.getId())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }

        if(payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new BusinessException(ErrorCode.PAYMENT_REFUNDED_NOT_ALLOWED);
        }

        if(request.amount() <= 0 || request.amount() > payment.getAmount()) {
            throw new BusinessException(ErrorCode.PAYMENT_REFUNDED_AMOUNT_INVALID);
        }

        PaymentRefund refund = PaymentRefund.builder()
                .payment(payment)
                .amount(request.amount())
                .reason(request.reason())
                .status(RefundStatus.REQUESTED)
                .requestedAt(LocalDateTime.now())
                .build();

        refund.markCompleted();
        payment.markRefunded();

        paymentRefundRepository.save(refund);
        paymentRepository.save(payment);

        return ResponseDto.success(null);
    }

    private PaymentResponseDto toDto(Payment payment) {
        return new PaymentResponseDto(
                payment.getId(),
                payment.getOrderId(),
                payment.getPaymentKey(),
                payment.getAmount(),
                payment.getMethod(),
                payment.getStatus(),
                payment.getProductCode(),
                payment.getProductName(),
                payment.getRequestedAt(),
                payment.getApprovedAt()
        );
    }
}
