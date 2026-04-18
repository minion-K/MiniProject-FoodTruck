package org.example.foodtruckback.dto.payment.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.example.foodtruckback.common.enums.PaymentMethod;

public record PaymentApproveRequestDto(
        @NotBlank
        String paymentKey,

        @NotBlank
        String tossOrderId,

        Long orderId,

        @NotNull
        Long amount,

        @NotNull
        PaymentMethod method,

        @NotBlank
        String productCode,

        String productName
) {}
