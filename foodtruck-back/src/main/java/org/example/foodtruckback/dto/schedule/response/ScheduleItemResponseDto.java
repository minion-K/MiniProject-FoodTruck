package org.example.foodtruckback.dto.schedule.response;

import org.example.foodtruckback.common.enums.ScheduleStatus;
import org.example.foodtruckback.entity.truck.Schedule;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ScheduleItemResponseDto(
        LocalDateTime startTime,
        LocalDateTime endTime,
        Long locationId,
        String locationName,
        BigDecimal latitude,
        BigDecimal longitude,
        ScheduleStatus status
) {
    public static ScheduleItemResponseDto from(Schedule schedule) {
        return new ScheduleItemResponseDto(
                schedule.getStartTime(),
                schedule.getEndTime(),
                schedule.getLocation().getId(),
                schedule.getLocation().getName(),
                schedule.getLocation().getLatitude(),
                schedule.getLocation().getLongitude(),
                schedule.getStatus()
        );
    }

    public boolean isNowActive() {
        LocalDateTime now = LocalDateTime.now();

        return status == ScheduleStatus.OPEN
                && !now.isBefore(startTime)
                && !now.isAfter(endTime);
    }
}