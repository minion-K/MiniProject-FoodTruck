package org.example.foodtruckback.dto.payment.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.example.foodtruckback.common.enums.PaymentMethod;

public record PaymentCreateRequestDto(
        Long orderId,

        @NotBlank
        String productCode,

        @NotBlank
        String productName,

        @NotNull
        @Min(value = 100)
        Long amount,

        @NotNull
        PaymentMethod method
) {}
