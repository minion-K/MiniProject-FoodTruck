package org.example.foodtruckback.dto.user.response;

import org.example.foodtruckback.common.enums.RoleType;
import org.example.foodtruckback.common.enums.UserStatus;
import org.example.foodtruckback.entity.user.User;
import java.time.LocalDateTime;

public record UserListResponseDto(
        Long id,
        String name,
        String loginId,
        String email,
        String phone,
        UserStatus status,
        RoleType[] roles,
        LocalDateTime createdAt
) {
    public static UserListResponseDto from(User user) {
        return new UserListResponseDto(
                user.getId(),
                user.getName(),
                user.getLoginId(),
                user.getEmail(),
                user.getPhone(),
                user.getStatus(),
                user.getRoleTypes().toArray(new RoleType[0]),
                user.getCreatedAt()
        );
    }
}
