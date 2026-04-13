package org.example.foodtruckback.dto.menuItem.request;

import jakarta.validation.constraints.NotNull;

public record MenuItemIsSoldOutRequestDto(
        @NotNull(message = "매진상태를 설정해주세요.")
        Boolean isSoldOut
) {}
