package org.example.foodtruckback.dto.statistics.response.admin;

import org.example.foodtruckback.common.enums.PaymentStatus;

public record PaymentStatusResponseDto(
        PaymentStatus status,
        Long count,
        Long amount
) {}
