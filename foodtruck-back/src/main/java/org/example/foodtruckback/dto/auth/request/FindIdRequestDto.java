package org.example.foodtruckback.dto.auth.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record FindIdRequestDto(
        @NotBlank
        String name,

        @NotBlank @Email
        String email
) {}
