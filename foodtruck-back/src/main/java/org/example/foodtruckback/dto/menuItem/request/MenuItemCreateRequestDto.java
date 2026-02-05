package org.example.foodtruckback.dto.menuItem.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record MenuItemCreateRequestDto(
        @NotBlank(message = "음식명을 입력해주세요.")
        String name,

        @NotNull(message = "가격을 설정해주세요.")
        @Min(0)
        int price,

        @Size(max = 255)
        String optionText
){}
