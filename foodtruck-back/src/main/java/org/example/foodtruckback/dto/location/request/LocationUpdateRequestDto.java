package org.example.foodtruckback.dto.location.request;

import java.math.BigDecimal;

public record LocationUpdateRequestDto(
    String name,
    String address,
    BigDecimal latitude,
    BigDecimal longitude
) {
}
