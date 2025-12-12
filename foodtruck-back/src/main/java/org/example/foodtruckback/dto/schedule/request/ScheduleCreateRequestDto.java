package org.example.foodtruckback.dto.schedule.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record ScheduleCreateRequestDto(
        @NotNull(message = "시작일을 지정해주세요.")
        LocalDateTime startTime,

        @NotNull(message = "마감일을 지정해주세요.")
        LocalDateTime endTime,

        @NotNull(message = "지역을 지정해주세요.")
        Long locationId,

        @Min(1) @Max(100)
        int maxReservations
){}
