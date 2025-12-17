package org.example.foodtruckback.dto.truck.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.example.foodtruckback.common.enums.TruckStatus;

public record TruckCreateRequestDto(
        @NotBlank(message = "트럭명을 입력해주세요.")
        String name,

        @Size(max = 50, message = "음식장르는 50자 내로 작성해주세요.")
        String cuisine,

        TruckStatus status
){}