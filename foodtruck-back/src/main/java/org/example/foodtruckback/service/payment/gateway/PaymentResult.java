package org.example.foodtruckback.service.payment.gateway;

import lombok.Builder;

@Builder
public record PaymentResult(
        boolean success,
        String paymentKey,
        String failureCode,
        String failureMessage
) {
    public static PaymentResult ok(String paymentKey) {
        return PaymentResult.builder()
                .success(true)
                .paymentKey(paymentKey)
                .build();
    }

    public static PaymentResult fail(String code, String message) {
        return PaymentResult.builder()
                .success(false)
                .failureCode(code)
                .failureMessage(message)
                .build();
    }
}
