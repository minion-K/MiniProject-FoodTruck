package org.example.foodtruckback.dto.reservation.response;

import org.example.foodtruckback.common.enums.ReservationStatus;
import org.example.foodtruckback.entity.reservation.Reservation;

import java.time.LocalDateTime;

public record ReservationListResponseDto(
        Long id,
        LocalDateTime pickupTime,
        ReservationStatus status
) {
    public static ReservationListResponseDto from(Reservation reservation) {
        return new ReservationListResponseDto(
                reservation.getId(),
                reservation.getPickupTime(),
                reservation.getStatus()
        );
    }
}
