package org.example.foodtruckback.dto.user.response;

import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.entity.user.UserRole;

import java.util.Set;

public record UserListResponseDto(
        String name,
        String loginId,
        String email
) {
    public static UserListResponseDto from(User user) {
        return new UserListResponseDto(
                user.getName(),
                user.getLoginId(),
                user.getEmail()
        );
    }
}
