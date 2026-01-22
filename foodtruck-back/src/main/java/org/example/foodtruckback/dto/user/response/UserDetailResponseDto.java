package org.example.foodtruckback.dto.user.response;

import org.example.foodtruckback.common.enums.AuthProvider;
import org.example.foodtruckback.common.enums.RoleType;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.entity.user.UserRole;
import java.util.Set;
import java.util.stream.Collectors;

public record UserDetailResponseDto(
        Long id,
        String name,
        String loginId,
        String email,
        String phone,
        Set<RoleType> roles,
        AuthProvider provider
) {
    public static UserDetailResponseDto from(User user) {
        return new UserDetailResponseDto(
                user.getId(),
                user.getName(),
                user.getLoginId(),
                user.getEmail(),
                user.getPhone(),
                user.getUserRoles().stream()
                        .map(role -> role.getRole().getName())
                        .collect(Collectors.toSet()),
                user.getProvider()
        );
    }
}
