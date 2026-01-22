package org.example.foodtruckback.dto.user.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AdminUserUpdateRequestDto(
        @NotBlank
        String name,

        @Email
        String email,

        String phone
) {
}
