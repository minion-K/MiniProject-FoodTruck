package org.example.foodtruckback.dto.statistics.response;

import java.time.LocalDateTime;

public record ScheduleSalesResponseDto(
        Long scheduleId,
        String locationName,
        LocalDateTime startTime,
        long sales
) {
}
