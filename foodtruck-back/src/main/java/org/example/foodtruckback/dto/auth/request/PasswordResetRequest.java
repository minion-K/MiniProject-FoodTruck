package org.example.foodtruckback.dto.auth.request;

import jakarta.validation.constraints.NotNull;

public record PasswordResetRequest(
        @NotNull(message = "토큰은 필수입니다.")
        String token,

        @NotNull(message = "새 비밀번호는 필수입니다.")
        String newPassword,

        @NotNull(message = "비밀번호 확인은 필수입니다.")
        String confirmPassword
) {}
