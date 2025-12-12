package org.example.foodtruckback.dto.location.response;

import org.example.foodtruckback.entity.location.Location;

import java.time.LocalDateTime;

public record LocationListItemResponseDto(
    Long id,
    String name,
    String address,
    LocalDateTime createdAt
) {
    public static LocationListItemResponseDto from(Location location) {
        return new LocationListItemResponseDto(
                location.getId(),
                location.getName(),
                location.getAddress(),
                location.getCreatedAt()
        );
    }
}
