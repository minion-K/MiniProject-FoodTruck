package org.example.foodtruckback.dto.orderItem.request;

import jakarta.validation.constraints.NotNull;
import org.example.foodtruckback.entity.truck.MenuItem;

public record CreateOrderItemRequestDto(
        @NotNull
        Long menuItemId,
        @NotNull
        int qty
) {
}
