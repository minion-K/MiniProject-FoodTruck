package org.example.foodtruckback.dto.auth.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record FindIdRequestDto(
        @NotBlank(message = "이메일은 필수입니다.") @Email
        String email
) {}
