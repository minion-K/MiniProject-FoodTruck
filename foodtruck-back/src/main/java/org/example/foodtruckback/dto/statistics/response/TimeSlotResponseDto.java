package org.example.foodtruckback.dto.statistics.response;

public record TimeSlotResponseDto(
        String timeSlot,
        long count
) {
}
