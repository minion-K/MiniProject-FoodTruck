package org.example.foodtruckback.dto.user.response;

import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.entity.user.UserRole;
import java.util.Set;

public record UserDetailResponseDto(
        String name,
        String loginId,
        String email,
        String phone,
        Set<UserRole> roles
) {
    public static UserDetailResponseDto from(User user) {
        return new UserDetailResponseDto(
                user.getName(),
                user.getLoginId(),
                user.getEmail(),
                user.getPhone(),
                user.getUserRoles()
        );
    }
}
