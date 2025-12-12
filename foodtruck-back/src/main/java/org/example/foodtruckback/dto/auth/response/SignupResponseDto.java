package org.example.foodtruckback.dto.auth.response;

import org.example.foodtruckback.entity.user.User;

public record SignupResponseDto(
        String name,
        String loginId,
        String email,
        String phone
) {
    public static SignupResponseDto from(User user) {
        return new SignupResponseDto(
                user.getName(),
                user.getLoginId(),
                user.getEmail(),
                user.getPhone()
        );
    }
}
