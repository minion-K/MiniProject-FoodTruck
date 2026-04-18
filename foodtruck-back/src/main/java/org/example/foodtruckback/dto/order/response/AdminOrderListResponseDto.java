package org.example.foodtruckback.dto.order.response;

import org.example.foodtruckback.common.enums.OrderSource;
import org.example.foodtruckback.common.enums.OrderStatus;
import org.example.foodtruckback.common.enums.PaymentStatus;
import org.example.foodtruckback.dto.orderItem.response.OrderItemResponseDto;
import org.example.foodtruckback.entity.order.Order;
import java.time.LocalDateTime;
import java.util.List;

public record AdminOrderListResponseDto(
        Long id,
        String truckName,
        String username,
        LocalDateTime startTime,
        LocalDateTime endTime,
        OrderSource source,
        OrderStatus status,
        PaymentStatus paymentStatus,
        int amount,
        String currency,
        LocalDateTime createdAt,
        List<OrderItemResponseDto> items
) {
    public static AdminOrderListResponseDto from(
            Order order, PaymentStatus paymentStatus
    ) {
        List<OrderItemResponseDto> items = order.getOrderItems().stream()
                .map(OrderItemResponseDto::from)
                .toList();

        return new AdminOrderListResponseDto(
                order.getId(),
                order.getSchedule().getTruck().getName(),
                order.getUser() != null ? order.getUser().getName() : "비회원",
                order.getSchedule().getStartTime(),
                order.getSchedule().getEndTime(),
                order.getSource(),
                order.getStatus(),
                paymentStatus,
                order.getAmount(),
                order.getCurrency(),
                order.getCreatedAt(),
                items
        );
    }
}