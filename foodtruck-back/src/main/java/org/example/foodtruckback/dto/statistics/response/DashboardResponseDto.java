package org.example.foodtruckback.dto.statistics.response;

public record DashboardResponseDto(
        long totalSales,
        long orderCount,
        long reservationCount
) {
}
