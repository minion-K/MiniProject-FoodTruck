package org.example.foodtruckback.dto.reservation.response;

import org.example.foodtruckback.common.enums.PaymentStatus;
import org.example.foodtruckback.common.enums.ReservationStatus;
import org.example.foodtruckback.entity.reservation.Reservation;

import java.time.LocalDateTime;
import java.util.List;

public record AdminReservationListResponseDto(
        Long id,
        String userName,
        String truckName,
        LocalDateTime pickupTime,
        ReservationStatus status,
        PaymentStatus paymentStatus,
        List<ReservationMenuItemResponseDto> menus
) {
    public static AdminReservationListResponseDto from(
            Reservation reservation,
            PaymentStatus paymentStatus
    ) {
        List<ReservationMenuItemResponseDto> menus = reservation.getMenuItems().stream()
                .map(ReservationMenuItemResponseDto::from)
                .toList();

        return new AdminReservationListResponseDto(
                reservation.getId(),
                reservation.getUser().getName(),
                reservation.getSchedule().getTruck().getName(),
                reservation.getPickupTime(),
                reservation.getStatus(),
                paymentStatus,
                menus
        );
    }
}
