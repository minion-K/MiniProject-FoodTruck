package org.example.foodtruckback.dto.statistics.response;

import java.util.List;

public record ScheduleDetailResponseDto(
        List<OrderTypeResponseDto> orderType,
        List<TopMenuResponseDto> topMenu,
        List<TimeSlotResponseDto> timeSlot
) {
}
