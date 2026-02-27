package org.example.foodtruckback.dto.order.response;

import org.example.foodtruckback.common.enums.OrderSource;
import org.example.foodtruckback.common.enums.OrderStatus;
import org.example.foodtruckback.common.enums.PaymentStatus;
import org.example.foodtruckback.dto.orderItem.response.OrderItemResponseDto;
import org.example.foodtruckback.entity.order.Order;

import java.time.LocalDateTime;
import java.util.List;

public record OwnerOrderListResponseDto(
        Long id,
        Long scheduleId,
        String username,
        OrderSource source,
        OrderStatus status,
        PaymentStatus paymentStatus,
        int amount,
        String currency,
        List<OrderItemResponseDto> menus,
        LocalDateTime createdAt
) {
    public static OwnerOrderListResponseDto from(
            Order order, PaymentStatus paymentStatus
    ) {
        List<OrderItemResponseDto> menus = order.getOrderItems().stream()
                .map(OrderItemResponseDto::from)
                .toList();

        return new OwnerOrderListResponseDto(
                order.getId(),
                order.getSchedule().getId(),
                order.getUser() != null ? order.getUser().getName() : "비회원",
                order.getSource(),
                order.getStatus(),
                paymentStatus,
                order.getAmount(),
                order.getCurrency(),
                menus,
                order.getCreatedAt()
        );
    }
}