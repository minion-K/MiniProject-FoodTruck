package org.example.foodtruckback.dto.statistics.response.admin;

import org.example.foodtruckback.common.enums.OrderSource;

public record OrderTypeResponseDto(
        OrderSource source,
        Long count,
        Long amount
) {}
