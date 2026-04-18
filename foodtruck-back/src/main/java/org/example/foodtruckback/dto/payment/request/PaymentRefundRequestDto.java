package org.example.foodtruckback.dto.payment.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record PaymentRefundRequestDto(
        @NotNull()
        @Min(value = 1)
        Long amount,

        String reason
) {}
