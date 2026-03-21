package org.example.foodtruckback.dto.statistics.response;

public record ScheduleDetailResponseDto(
        long orderCount,
        long reservationCount,
        long totalSales
) {
}
