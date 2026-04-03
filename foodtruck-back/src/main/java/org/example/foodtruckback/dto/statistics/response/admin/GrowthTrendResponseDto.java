package org.example.foodtruckback.dto.statistics.response.admin;

public record GrowthTrendResponseDto(
        String date,
        Long revenue,
        Long orderCount,
        Long userCount,
        Long truckCount
) {}
