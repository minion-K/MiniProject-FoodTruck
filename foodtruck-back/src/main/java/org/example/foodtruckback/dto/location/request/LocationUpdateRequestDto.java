package org.example.foodtruckback.dto.location.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record LocationUpdateRequestDto(
        @NotBlank
        String name,

        String address,

        @NotNull
        BigDecimal latitude,

        @NotNull
        BigDecimal longitude
) {}
