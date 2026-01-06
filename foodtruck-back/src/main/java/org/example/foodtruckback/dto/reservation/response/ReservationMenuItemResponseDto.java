package org.example.foodtruckback.dto.reservation.response;

import org.example.foodtruckback.entity.reservation.ReservationItem;

public record ReservationMenuItemResponseDto(
        Long menuItemId,
        String name,
        int price,
        int quantity
) {
    public static ReservationMenuItemResponseDto from(ReservationItem item) {
        return new ReservationMenuItemResponseDto(
                item.getMenuItemId(),
                item.getMenuName(),
                item.getPrice(),
                item.getQty()
        );
    }
}
