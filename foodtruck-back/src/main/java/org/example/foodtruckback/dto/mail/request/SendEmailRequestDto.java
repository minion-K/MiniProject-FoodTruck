package org.example.foodtruckback.dto.mail.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record SendEmailRequestDto(
        @NotBlank(message = "이메일을 입력해주세요") @Email
        String email
) {}
