package org.example.foodtruckback.dto.reservation.request;

import jakarta.validation.constraints.Size;

public record ReservationStatusUpdateRequestDto(
        @Size(max = 255)
        String note
) {}
