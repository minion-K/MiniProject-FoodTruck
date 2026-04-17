package org.example.foodtruckback.controller.payment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.constants.payment.PaymentApi;
import org.example.foodtruckback.common.enums.PaymentStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.payment.request.PaymentApproveRequestDto;
import org.example.foodtruckback.dto.payment.request.PaymentCreateRequestDto;
import org.example.foodtruckback.dto.payment.request.PaymentRefundRequestDto;
import org.example.foodtruckback.dto.payment.response.PaymentPageResponseDto;
import org.example.foodtruckback.dto.payment.response.PaymentResponseDto;
import org.example.foodtruckback.security.user.UserPrincipal;
import org.example.foodtruckback.service.payment.PaymentService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(PaymentApi.ROOT)
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<ResponseDto<?>> createPayment(
            @Valid @RequestBody PaymentCreateRequestDto request
    ) {
        var response = paymentService.createPayment(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping(PaymentApi.APPROVE)
    public ResponseEntity<ResponseDto<?>> approvePayment(
            @Valid @RequestBody PaymentApproveRequestDto request
    ) {
        var response = paymentService.approvePayment(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping(PaymentApi.ME)
    public ResponseEntity<ResponseDto<PaymentPageResponseDto>> getMyPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) PaymentStatus status
            ) {
        Pageable pageable = PageRequest.of(page, size);

        ResponseDto<PaymentPageResponseDto> response = paymentService.getMyPayments(pageable, keyword, status);

        return ResponseEntity.ok(response);
    }

    @PostMapping(PaymentApi.REFUND)
    public ResponseEntity<ResponseDto<Void>> refundPayment(
            @PathVariable Long paymentId,
            @Valid @RequestBody PaymentRefundRequestDto request
    ) {
        ResponseDto<Void> response = paymentService.refundPayment(paymentId, request);

        return ResponseEntity.ok(response);
    }
}
