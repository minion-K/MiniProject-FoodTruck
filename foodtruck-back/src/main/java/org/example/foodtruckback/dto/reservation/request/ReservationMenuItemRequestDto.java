package org.example.foodtruckback.dto.reservation.request;

import jakarta.validation.constraints.NotNull;

public record ReservationMenuItemRequestDto(
        @NotNull
        Long menuItemId,

        @NotNull
        int quantity
) {
}
