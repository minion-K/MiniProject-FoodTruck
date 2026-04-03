package org.example.foodtruckback.dto.statistics.response.admin;

public record TopMenusResponseDto(
        String menuName,
        Long quantity,
        Long revenue
) {}
