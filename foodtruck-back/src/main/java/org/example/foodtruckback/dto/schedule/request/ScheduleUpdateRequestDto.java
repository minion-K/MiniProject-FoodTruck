package org.example.foodtruckback.dto.schedule.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import org.example.foodtruckback.common.enums.ScheduleStatus;

import java.time.LocalDateTime;

public record ScheduleUpdateRequestDto(
        @NotNull(message = "시작 시간을 지정해주세요.")
        LocalDateTime startTime,

        @NotNull(message = "마감 시간을 지정해주세요.")
        LocalDateTime endTime,

        @NotNull(message = "장소를 지정해주세요.")
        Long locationId,

        Integer maxReservations
) {}
