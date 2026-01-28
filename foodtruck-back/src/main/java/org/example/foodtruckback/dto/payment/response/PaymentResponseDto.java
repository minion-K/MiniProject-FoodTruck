package org.example.foodtruckback.dto.payment.response;

import org.example.foodtruckback.common.enums.PaymentMethod;
import org.example.foodtruckback.common.enums.PaymentStatus;
import org.example.foodtruckback.entity.payment.Payment;

import java.time.LocalDateTime;

public record PaymentResponseDto(
        Long id,
        String orderId,
        String paymentKey,
        Long amount,
        PaymentMethod method,
        PaymentStatus status,
        String productCode,
        String productName,
        LocalDateTime requestedAt,
        LocalDateTime approvedAt
) {
    public static PaymentResponseDto from(Payment payment) {
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
