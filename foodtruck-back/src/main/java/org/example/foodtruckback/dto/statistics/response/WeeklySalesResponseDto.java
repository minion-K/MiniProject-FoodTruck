package org.example.foodtruckback.dto.statistics.response;

public record WeeklySalesResponseDto(
        Object date,
        long sales
) {
}
