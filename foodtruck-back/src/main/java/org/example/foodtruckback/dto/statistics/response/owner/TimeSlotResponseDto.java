package org.example.foodtruckback.dto.statistics.response.owner;

public record TimeSlotResponseDto(
        String timeSlot,
        long count
) {
}
