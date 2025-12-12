package org.example.foodtruckback.dto.orderItem.response;

public record OrderItemResponseDto(
        Long menuItemId,
        int qty,
        int unitPrice
) {
}
