package org.example.foodtruckback.dto.truck.request;

import jakarta.validation.constraints.Size;
import org.example.foodtruckback.common.enums.TruckStatus;

public record TruckUpdateRequestDto(
        @Size(max = 100, message = "트럭명은 100자 내로 작성해주세요.")
        String name,

        @Size(max = 50, message = "음식장르는 50자 내로 작성해주세요.")
        String cuisine
) {}
