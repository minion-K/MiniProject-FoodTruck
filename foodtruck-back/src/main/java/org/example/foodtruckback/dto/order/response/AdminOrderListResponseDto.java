package org.example.foodtruckback.dto.order.response;

import org.example.foodtruckback.common.enums.OrderSource;
import org.example.foodtruckback.common.enums.OrderStatus;
import org.example.foodtruckback.common.enums.PaymentStatus;
import org.example.foodtruckback.entity.order.Order;

import java.time.LocalDateTime;

public record AdminOrderListResponseDto(
        Long id,
        Long scheduleId,
        Long userId,
        String username,
        Long reservationId,
        OrderSource source,
        OrderStatus status,
        PaymentStatus paymentStatus,
        int amount,
        String currency,
        LocalDateTime createdAt
) {
    public static AdminOrderListResponseDto from(
            Order order, PaymentStatus paymentStatus
    ) {
        return new AdminOrderListResponseDto(
                order.getId(),
                order.getSchedule().getId(),
                order.getUser() != null ? order.getUser().getId() : null,
                order.getUser() != null ? order.getUser().getName() : null,
                order.getReservation() != null ? order.getReservation().getId() : null,
                order.getSource(),
                order.getStatus(),
                paymentStatus,
                order.getAmount(),
                order.getCurrency(),
                order.getCreatedAt()
        );
    }
}