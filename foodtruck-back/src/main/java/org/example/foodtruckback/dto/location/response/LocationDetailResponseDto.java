package org.example.foodtruckback.dto.location.response;

import org.example.foodtruckback.entity.location.Location;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record LocationDetailResponseDto(
        Long id,
        String name,
        String address,
        BigDecimal latitude,
        BigDecimal longitude,
        LocalDateTime createdAt
) {
    public static LocationDetailResponseDto from(Location location) {
        return new LocationDetailResponseDto(
                location.getId(),
                location.getName(),
                location.getAddress(),
                location.getLatitude(),
                location.getLongitude(),
                location.getCreatedAt()
        );
    }
}
