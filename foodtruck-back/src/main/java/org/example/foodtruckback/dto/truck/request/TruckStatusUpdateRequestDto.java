package org.example.foodtruckback.dto.truck.request;

import org.example.foodtruckback.common.enums.TruckStatus;

public record TruckStatusUpdateRequestDto(
        TruckStatus status
) {
}
