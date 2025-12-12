package org.example.foodtruckback.dto.auth.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.example.foodtruckback.entity.user.User;

import java.security.AuthProvider;

public record SignupRequestDto(
    @NotBlank(message = "이름은 필수입니다.")
    @Size(max = 50)
    String name,

    @NotBlank(message = "아이디는 필수입니다.")
    @Size(max = 50)
    String login,

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Size(min = 8,max = 16)
    String password,

    @NotBlank(message = "비밀번호 확인은 필수입니다.")
    @Size(min = 8,max = 16)
    String confirmPassword,

    @NotBlank(message = "이메일은 필수입니다.")
    @Size(max = 255)
    String email,

    @Size(max = 255)
    String phone

) {
    public User toEntity(String encodedPassword) {
        return User.builder()
                .name(name)
                .loginId((login))
                .password(encodedPassword)
                .email(email)
                .phone(phone)
                .build();

    }
}
