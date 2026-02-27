package org.example.foodtruckback.dto.order.response;

import org.example.foodtruckback.common.enums.OrderSource;
import org.example.foodtruckback.common.enums.OrderStatus;
import org.example.foodtruckback.common.enums.PaymentStatus;
import org.example.foodtruckback.entity.order.Order;

import java.time.LocalDateTime;

public record UserOrderListResponseDto(
        Long id,
        Long scheduleId,
        Long userId,
        int amount,
        String currency,
        OrderStatus status,
        PaymentStatus paymentStatus,
        LocalDateTime createdAt
) {
    public static UserOrderListResponseDto from(
            Order order, PaymentStatus paymentStatus
    ) {
        return new UserOrderListResponseDto(
                order.getId(),
                order.getSchedule().getId(),
                order.getUser() != null ? order.getUser().getId() : null,
                order.getAmount(),
                order.getCurrency(),
                order.getStatus(),
                paymentStatus,
                order.getCreatedAt()
        );
    }
}