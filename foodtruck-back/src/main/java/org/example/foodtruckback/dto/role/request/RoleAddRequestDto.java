package org.example.foodtruckback.dto.role.request;

import org.example.foodtruckback.common.enums.RoleType;

public record RoleAddRequestDto(
        RoleType roleName
) {
}
