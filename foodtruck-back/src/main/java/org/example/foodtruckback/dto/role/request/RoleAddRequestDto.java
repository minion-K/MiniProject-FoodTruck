package org.example.foodtruckback.dto.role.request;

import jakarta.validation.constraints.NotBlank;
import org.example.foodtruckback.common.enums.RoleType;

public record RoleAddRequestDto(
        String name
) {
}
