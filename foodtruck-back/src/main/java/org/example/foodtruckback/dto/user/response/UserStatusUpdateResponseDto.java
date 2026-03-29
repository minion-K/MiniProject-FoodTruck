package org.example.foodtruckback.dto.user.response;

public record UserStatusUpdateResponseDto(
        Long userId,
        String status
) {}
