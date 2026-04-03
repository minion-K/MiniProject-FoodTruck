package org.example.foodtruckback.dto.statistics.response.admin;

public record TopTrucksResponseDto(
        Long truckId,
        String truckName,
        Long revenue,
        Long orderCount,
        Double avgSalesPerOrder
) {}
