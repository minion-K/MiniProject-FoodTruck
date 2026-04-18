package org.example.foodtruckback.dto.orderItem.request;

import jakarta.validation.constraints.NotNull;

public record UpdateOrderItemRequestDto(
        @NotNull
        Long menuItemId,

        @NotNull
        int qty
) {
}
