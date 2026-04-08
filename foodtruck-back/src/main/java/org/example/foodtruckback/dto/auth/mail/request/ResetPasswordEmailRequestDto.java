package org.example.foodtruckback.dto.auth.mail.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ResetPasswordEmailRequestDto(
        @NotBlank
        String name,

        @NotBlank
        String loginId,

        @Email
        String email
) {
}
