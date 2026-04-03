package org.example.foodtruckback.dto.statistics.response.owner;

public record DashboardResponseDto(
        long totalSales,
        long orderCount,
        long reservationCount
) {
}
