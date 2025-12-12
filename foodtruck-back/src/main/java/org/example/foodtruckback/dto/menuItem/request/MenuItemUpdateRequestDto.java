package org.example.foodtruckback.dto.menuItem.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MenuItemUpdateRequestDto(
        @Size(max = 100, message = "음식명은 최대 100자 입니다.")
        String name,

        @DecimalMin("0.0")
        int price,

        @Size(max = 255)
        String optionText,

        @NotNull(message = "매진상태를 설정해주세요.")
        Boolean isSoldOut
){}
