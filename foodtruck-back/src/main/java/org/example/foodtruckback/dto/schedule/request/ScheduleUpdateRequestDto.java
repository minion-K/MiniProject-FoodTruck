package org.example.foodtruckback.dto.schedule.request;

import org.example.foodtruckback.common.enums.ScheduleStatus;

import java.time.LocalDateTime;

public record ScheduleUpdateRequestDto(
        LocalDateTime startTime,
        LocalDateTime endTime,
        ScheduleStatus status,
        int maxReservations
){}
