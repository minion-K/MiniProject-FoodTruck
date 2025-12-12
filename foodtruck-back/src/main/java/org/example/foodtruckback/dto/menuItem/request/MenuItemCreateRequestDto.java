package org.example.foodtruckback.dto.menuItem.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record MenuItemCreateRequestDto(
        @NotNull(message = "트럭 ID를 입력해주세요.")
        Long truckId,

        @NotBlank(message = "음식명을 작성해주세요.")
        String name,

        @NotNull(message = "가격을 살정해주세요.")
        @DecimalMin("0.0")
        int price,

        @Size(max = 255)
        String optionText
){}
