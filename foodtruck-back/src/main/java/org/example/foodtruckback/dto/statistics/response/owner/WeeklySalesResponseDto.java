package org.example.foodtruckback.dto.statistics.response.owner;

public record WeeklySalesResponseDto(
        Object date,
        long sales
) {
}
