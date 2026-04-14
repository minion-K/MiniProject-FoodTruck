package org.example.foodtruckback.dto.truck.response;

public record TruckCountResponseDto(
        long total,
        long active,
        long suspended
) {
}
