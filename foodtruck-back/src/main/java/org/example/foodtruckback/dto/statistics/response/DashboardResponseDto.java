package org.example.foodtruckback.dto.statistics.response;

public record DashboardResponseDto(
        long todaySales,
        long todayOrders,
        long todayReservations
) {
}
