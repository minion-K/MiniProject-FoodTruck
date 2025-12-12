package org.example.foodtruckback.dto.order.response;

import org.example.foodtruckback.common.enums.OrderSource;
import org.example.foodtruckback.common.enums.OrderStatus;

import java.time.LocalDateTime;

public record OrderListItemResponseDto(
        Long id,
        Long scheduleId,
        Long userId,
        OrderSource source,
        int amount,
        OrderStatus status,
        LocalDateTime createdAt
) {
}
