package org.example.foodtruckback.dto.reservation.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.example.foodtruckback.common.enums.ReservationStatus;

public record ReservationStatusUpdateRequestDto(
        @NotNull
        ReservationStatus status,
        @Size(max = 255)
        String note
) {}
