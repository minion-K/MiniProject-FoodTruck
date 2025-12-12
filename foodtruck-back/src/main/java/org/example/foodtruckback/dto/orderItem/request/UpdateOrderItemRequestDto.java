package org.example.foodtruckback.dto.orderItem.request;

public record UpdateOrderItemRequestDto(
        Long menuItemId,
        int qty
) {
}
