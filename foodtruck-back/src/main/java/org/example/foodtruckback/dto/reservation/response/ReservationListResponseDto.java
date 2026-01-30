package org.example.foodtruckback.dto.reservation.response;

import org.example.foodtruckback.common.enums.PaymentStatus;
import org.example.foodtruckback.common.enums.ReservationStatus;
import org.example.foodtruckback.entity.reservation.Reservation;

import java.time.LocalDateTime;

public record ReservationListResponseDto(
        Long id,
        LocalDateTime pickupTime,
        ReservationStatus status,
        PaymentStatus paymentStatus,
        int totalAmount,
        String truckName,
        String locationName
) {
    public static ReservationListResponseDto from(
            Reservation reservation, PaymentStatus paymentStatus
    ) {
        return new ReservationListResponseDto(
                reservation.getId(),
                reservation.getPickupTime(),
                reservation.getStatus(),
                paymentStatus,
                reservation.getTotalAmount(),
                reservation.getSchedule().getTruck().getName(),
                reservation.getSchedule().getLocationName()
        );
    }
}
