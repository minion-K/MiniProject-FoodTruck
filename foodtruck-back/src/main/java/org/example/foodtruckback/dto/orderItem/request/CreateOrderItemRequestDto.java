package org.example.foodtruckback.dto.orderItem.request;

import jakarta.validation.constraints.NotNull;

public record CreateOrderItemRequestDto(
        @NotNull
        Long menuItemId,

        @NotNull
        int qty
) {
}
