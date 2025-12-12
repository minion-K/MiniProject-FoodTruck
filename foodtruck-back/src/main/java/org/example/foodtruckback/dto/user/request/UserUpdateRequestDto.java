package org.example.foodtruckback.dto.user.request;

public record UserUpdateRequestDto(

        String name,
        String email,
        String phone
) {}
