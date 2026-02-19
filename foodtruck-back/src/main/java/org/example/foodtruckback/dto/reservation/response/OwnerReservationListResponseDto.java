package org.example.foodtruckback.dto.reservation.response;

import org.example.foodtruckback.common.enums.PaymentStatus;
import org.example.foodtruckback.common.enums.ReservationStatus;
import org.example.foodtruckback.entity.reservation.Reservation;

import java.time.LocalDateTime;
import java.util.List;

public record OwnerReservationListResponseDto(
        Long id,
        String userName,
        LocalDateTime pickupTime,
        ReservationStatus status,
        PaymentStatus paymentStatus,
        List<ReservationMenuItemResponseDto> menus
) {
    public static OwnerReservationListResponseDto from(
            Reservation reservation,
            PaymentStatus paymentStatus
    ) {
        List<ReservationMenuItemResponseDto> menus = reservation.getMenuItems().stream()
                .map(ReservationMenuItemResponseDto::from)
                .toList();

        return new OwnerReservationListResponseDto(
                reservation.getId(),
                reservation.getUser().getName(),
                reservation.getPickupTime(),
                reservation.getStatus(),
                paymentStatus,
                menus
        );
    }
}
