package org.example.foodtruckback.dto.order.response;

import org.example.foodtruckback.common.enums.OrderSource;
import org.example.foodtruckback.common.enums.OrderStatus;
import org.example.foodtruckback.dto.orderItem.response.OrderItemResponseDto;

import java.time.LocalDateTime;
import java.util.List;

public record OrderDetailResponseDto(
        Long id,
        Long scheduleId,
        Long userId,
        OrderSource source,
        Long reservationId,
        int amount,
        String currency,
        OrderStatus status,

        LocalDateTime paidAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,

        List<OrderItemResponseDto> items
) {
}
