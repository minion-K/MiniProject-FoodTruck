package org.example.foodtruckback.dto.menuItem.response;

import org.example.foodtruckback.entity.truck.MenuItem;

import java.time.LocalDateTime;

public record MenuItemDetailResponseDto(
        Long id,
        Long truckId,
        String name,
        int price,
        boolean isSoldOut,
        String optionText,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
){
    public static MenuItemDetailResponseDto from(MenuItem menuItem){
        return new MenuItemDetailResponseDto(
                menuItem.getId(),
                menuItem.getTruck().getId(),
                menuItem.getName(),
                menuItem.getPrice(),
                menuItem.isSoldOut(),
                menuItem.getOptionText(),
                menuItem.getCreatedAt(),
                menuItem.getUpdatedAt()
        );
    }
}
