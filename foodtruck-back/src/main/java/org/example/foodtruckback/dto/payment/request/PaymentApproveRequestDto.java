package org.example.foodtruckback.dto.payment.request;

import jakarta.validation.constraints.NotNull;
import org.example.foodtruckback.common.enums.PaymentMethod;

public record PaymentApproveRequestDto(
        String paymentKey,
        String orderId,
        Long amount,

        @NotNull(message = "결제 수단은 필수입니다.")
        PaymentMethod method,

        String productCode,
        String productName
) {}
