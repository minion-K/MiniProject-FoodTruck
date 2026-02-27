package org.example.foodtruckback.dto.order.response;

import org.example.foodtruckback.common.enums.OrderSource;
import org.example.foodtruckback.common.enums.OrderStatus;
import org.example.foodtruckback.dto.orderItem.response.OrderItemResponseDto;
import org.example.foodtruckback.entity.order.Order;
import org.example.foodtruckback.entity.order.OrderItem;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public record OrderDetailResponseDto(
        Long id,
        Long scheduleId,
        Long userId,
        String username,
        OrderSource source,
        Long reservationId,
        int amount,
        String currency,
        OrderStatus status,

        LocalDateTime paidAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,

        List<OrderItemResponseDto> menus
) {
    public static OrderDetailResponseDto from(Order order) {
        return new OrderDetailResponseDto(
                order.getId(),
                order.getSchedule().getId(),
                order.getUser() != null ? order.getUser().getId() : null,
                order.getUser() != null ? order.getUser().getName() : null,
                order.getSource(),
                order.getReservation() != null ? order.getReservation().getId() : null,
                order.getAmount(),
                order.getCurrency(),
                order.getStatus(),
                order.getPaidAt(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                order.getOrderItems().stream()
                        .map(OrderItemResponseDto::from)
                        .collect(Collectors.toList())
        );
    }
}