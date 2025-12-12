package org.example.foodtruckback.dto.reservation.response;

import org.example.foodtruckback.common.enums.ReservationStatus;
import org.example.foodtruckback.entity.reservation.Reservation;

import java.time.LocalDateTime;

public record ReservationResponseDto(
        Long id,
        Long scheduleId,
        Long userId,
        LocalDateTime pickupTime,
        int totalAmount,
        ReservationStatus status,
        String note
) {

    public static ReservationResponseDto from(Reservation reservation) {
        return new ReservationResponseDto(
                reservation.getId(),
                reservation.getSchedule().getId(),
                reservation.getUser().getId(),
                reservation.getPickupTime(),
                reservation.getTotalAmount(),
                reservation.getStatus(),
                reservation.getNote()
        );
    }
}
