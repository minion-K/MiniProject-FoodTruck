package org.example.foodtruckback.dto.schedule.request;

import org.example.foodtruckback.common.enums.ScheduleStatus;

public record ScheduleStatusUpdateRequestDto(
        ScheduleStatus status
) {
}
