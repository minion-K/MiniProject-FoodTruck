package org.example.foodtruckback.dto.auth.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.example.foodtruckback.entity.user.User;

public record SignupRequestDto(
    @NotBlank(message = "이름은 필수입니다.")
    @Size(max = 50)
    String name,

    @NotBlank(message = "아이디는 필수입니다.")
    @Size(min = 4, max = 20)
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)([A-Za-z\\d]){4,20}$",
            message = "아이디는 영문과 숫자만 가능합니다."
    )
    String loginId,

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Size(min = 8,max = 16)
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()+=-]).{8,16}$",
            message = "영문, 숫자, 특수문자를 포함하여 8~16자로 입력해주세요"
    )
    String password,

    @NotBlank(message = "비밀번호 확인은 필수입니다.")
    @Size(min = 8,max = 16)
    String confirmPassword,

    @NotBlank(message = "이메일은 필수입니다.")
    @Size(max = 255)
    @Email(message = "올바른 이메일 형식으로 입력해주세요")
    String email,

    @Size(max = 30)
    @Pattern(
            regexp = "^\\d{10,11}$",
            message = "휴대폰 번호는 10~11자리 숫자만 가능합니다."
    )
    String phone

) {}
