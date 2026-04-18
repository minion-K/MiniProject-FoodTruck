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
import org.example.foodtruckback.dto.payment.response.PaymentPageResponseDto;
import org.example.foodtruckback.dto.payment.response.PaymentResponseDto;
import org.example.foodtruckback.entity.order.Order;
import org.example.foodtruckback.entity.payment.Payment;
import org.example.foodtruckback.entity.payment.PaymentRefund;
import org.example.foodtruckback.entity.reservation.Reservation;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.exception.BusinessException;
import org.example.foodtruckback.repository.order.OrderRepository;
import org.example.foodtruckback.repository.payment.PaymentRefundRepository;
import org.example.foodtruckback.repository.payment.PaymentRepository;
import org.example.foodtruckback.repository.reservation.ReservationRepository;
import org.example.foodtruckback.security.util.AuthorizationChecker;
import org.example.foodtruckback.service.payment.gateway.PaymentGateway;
import org.example.foodtruckback.service.payment.gateway.PaymentGatewayResolver;
import org.example.foodtruckback.service.payment.gateway.PaymentResult;
import org.example.foodtruckback.service.policy.TruckPolicy;
import org.example.foodtruckback.service.policy.UserPolicy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final PaymentRefundRepository paymentRefundRepository;
    private final PaymentGatewayResolver gatewayResolver;
    private final ReservationRepository reservationRepository;
    private final OrderRepository orderRepository;
    private final AuthorizationChecker authorizationChecker;

    @Transactional
    public ResponseDto<?> createPayment(
            PaymentCreateRequestDto request
    ) {
        User user = authorizationChecker.getCurrentUser();
        UserPolicy.validateActive(user);

        Order order = orderRepository.findById(request.orderId())
                .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND));
        TruckPolicy.validateActive(order.getSchedule().getTruck());

        return switch(request.method()) {
            case MOCK -> ResponseDto.success(processMockPayment(user, request));
            case TOSS_PAY -> throw new BusinessException(ErrorCode.INVALID_INPUT);
        };
    }

    private PaymentResponseDto processMockPayment(
            User user, PaymentCreateRequestDto request
    ) {
        Payment payment = Payment.builder()
                .user(user)
                .orderId(request.orderId())
                .paymentOrderId("ORD-" + UUID.randomUUID())
                .paymentKey("MOCK-" + UUID.randomUUID())
                .amount(request.amount())
                .method(PaymentMethod.MOCK)
                .status(PaymentStatus.READY)
                .productCode(request.productCode())
                .productName(request.productName())
                .build();

        payment.markSuccess();

        Order order = orderRepository.findById(request.orderId())
                        .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND));

        TruckPolicy.validateActive(order.getSchedule().getTruck());
        order.paid();
        paymentRepository.save(payment);

        return toDto(payment);
    }

    @Transactional
    public ResponseDto<PaymentResponseDto> approvePayment(
            PaymentApproveRequestDto request
    ) {
        User user = authorizationChecker.getCurrentUser();
        UserPolicy.validateActive(user);

        Order order = null;
        Long orderId = request.orderId();

        if(orderId != null) {
            order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND));
            TruckPolicy.validateActive(order.getSchedule().getTruck());

            Long totalAmount = order.getOrderItems().stream()
                    .mapToLong(item -> (long) item.getPrice() * item.getQty())
                    .sum();

            if(!totalAmount.equals(request.amount())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT);
            }

            if(paymentRepository.existsByOrderIdAndStatus(
                    request.orderId(), PaymentStatus.SUCCESS
            )) {
                throw new BusinessException(ErrorCode.PAYMENT_ALREADY_PROCESSED);
            }
        }

        if(orderId == null) {
            Long reservationId = Long.valueOf(request.productCode().replace("RES-", ""));

            Reservation reservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.RESERVATION_NOT_FOUND));
            TruckPolicy.validateActive(reservation.getSchedule().getTruck());

            if(paymentRepository.existsByProductCodeAndStatus(
                    request.productCode(), PaymentStatus.SUCCESS
            )) {
                throw new BusinessException(ErrorCode.PAYMENT_ALREADY_PROCESSED);
            }
        }

        PaymentGateway gateway = gatewayResolver.resolve(request.method());
        PaymentResult result = gateway.approve(request, user.getId().toString());

        Payment payment = Payment.builder()
                .user(user)
                .orderId(request.orderId())
                .paymentOrderId("PAY-" + UUID.randomUUID())
                .paymentKey(result.paymentKey())
                .amount(request.amount())
                .method(request.method())
                .status(result.success() ? PaymentStatus.READY : PaymentStatus.FAILED)
                .productCode(request.productCode())
                .productName(request.productName())
                .failureCode(result.failureCode())
                .failureMessage(result.failureMessage())
                .build();

        if(result.success()) {
            payment.markSuccess();

            if(order != null) {
                order.paid();
            }
        }

        paymentRepository.save(payment);

        return ResponseDto.success(toDto(payment));
    }

    public ResponseDto<PaymentPageResponseDto> getMyPayments(
            Pageable pageable,
            String keyword, PaymentStatus status
    ) {
        User user = authorizationChecker.getCurrentUser();

        Page<Payment> paymentPage = paymentRepository.findByUserWithUser(user, pageable, keyword, status);

        List<PaymentResponseDto> content = paymentPage.stream()
                .map(PaymentResponseDto::from)
                .toList();

        PaymentPageResponseDto response = new PaymentPageResponseDto(
                content,
                paymentPage.getTotalPages(),
                paymentPage.getTotalElements(),
                paymentPage.getNumber()
        );
        return ResponseDto.success(response);
    }

    @Transactional
    public ResponseDto<Void> refundPayment(
            Long paymentId,
            PaymentRefundRequestDto request
    ) {
        User user = authorizationChecker.getCurrentUser();
        UserPolicy.validateActive(user);

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PAYMENT_NOT_FOUND));

        if(!payment.getUser().getId().equals(user.getId())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }

        if(request.amount() <= 0 || request.amount() > payment.getAmount()) {
            throw new BusinessException(ErrorCode.PAYMENT_REFUNDED_AMOUNT_INVALID);
        }

        refundCore(payment, request.amount(), request.reason());

        return ResponseDto.success(null);
    }

    @Transactional
    public void refundInternal(
            Payment payment,
            Long amount,
            String reason
    ) {
        if(payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new BusinessException(ErrorCode.PAYMENT_REFUNDED_NOT_ALLOWED);
        }

        refundCore(payment, amount, reason);
    }

    private void refundCore(
            Payment payment,
            Long amount,
            String reason
    ) {
        PaymentRefund refund = PaymentRefund.builder()
                .payment(payment)
                .amount(amount)
                .reason(reason)
                .status(RefundStatus.REQUESTED)
                .requestedAt(LocalDateTime.now())
                .build();

        refund.markCompleted();
        payment.markRefunded();

        paymentRefundRepository.save(refund);
        paymentRepository.save(payment);
    }

    private PaymentResponseDto toDto(Payment payment) {
        return new PaymentResponseDto(
                payment.getId(),
                payment.getOrderId(),
                payment.getPaymentOrderId(),
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
