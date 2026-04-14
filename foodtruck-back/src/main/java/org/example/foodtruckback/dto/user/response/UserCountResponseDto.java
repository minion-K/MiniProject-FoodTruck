package org.example.foodtruckback.dto.user.response;

public record UserCountResponseDto(
        long total,
        long user,
        long owner,
        long admin
) {
}
