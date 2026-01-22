package org.example.foodtruckback.dto.user.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserUpdateRequestDto(
        @NotBlank
        String name,

        @Size(min = 10, max = 11)
        @Pattern(regexp = "^\\d+$")
        String phone
) {}
