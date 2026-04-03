package org.example.foodtruckback.dto.statistics.response.admin;

public record InsightResponseDto(
        String category,
        String title,
        String description,
        Object value,
        String unit
) {}
