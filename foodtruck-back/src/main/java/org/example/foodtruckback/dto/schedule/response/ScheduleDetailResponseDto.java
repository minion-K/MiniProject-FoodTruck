package org.example.foodtruckback.dto.schedule.response;

import org.example.foodtruckback.common.enums.ScheduleStatus;
import org.example.foodtruckback.entity.truck.Schedule;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ScheduleDetailResponseDto(
        Long id,
        Long truckId,
        Long locationId,
        String locationName,
        BigDecimal latitude,
        BigDecimal longitude,
        LocalDateTime startTime,
        LocalDateTime endTime,
        ScheduleStatus status,
        int maxReservations,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
){
    public static ScheduleDetailResponseDto from(Schedule schedule) {
        return new ScheduleDetailResponseDto(
                schedule.getId(),
                schedule.getTruck().getId(),
                schedule.getLocation().getId(),
                schedule.getLocation().getName(),
                schedule.getLocation().getLatitude(),
                schedule.getLocation().getLongitude(),
                schedule.getStartTime(),
                schedule.getEndTime(),
                schedule.getStatus(),
                schedule.getMaxReservations(),
                schedule.getCreatedAt(),
                schedule.getUpdatedAt()
        );
    }
}
