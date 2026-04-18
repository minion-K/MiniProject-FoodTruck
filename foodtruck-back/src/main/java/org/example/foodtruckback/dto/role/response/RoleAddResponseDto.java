package org.example.foodtruckback.dto.role.response;

import org.example.foodtruckback.common.enums.RoleType;
import org.example.foodtruckback.entity.user.Role;

public record RoleAddResponseDto(
        RoleType roleName
) {
    public static RoleAddResponseDto from(Role role) {
        return new RoleAddResponseDto(
                role.getName()
        );
    }

}
