package org.example.foodtruckback.dto.truck.response;

import org.example.foodtruckback.common.enums.TruckStatus;
import org.example.foodtruckback.dto.menuItem.response.MenuItemDetailResponseDto;
import org.example.foodtruckback.dto.schedule.response.ScheduleItemResponseDto;
import org.example.foodtruckback.entity.truck.Schedule;
import org.example.foodtruckback.entity.truck.Truck;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

public record TruckDetailResponseDto(
        Long id,
        Long ownerId,
        String name,
        String cuisine,
        TruckStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<ScheduleItemResponseDto> schedules,
        List<MenuItemDetailResponseDto> menu,
        String locationSummary
) {
    public static TruckDetailResponseDto from(
            Truck truck,
            List<ScheduleItemResponseDto> schedules,
            List<MenuItemDetailResponseDto> menu
    ) {

        String locationSummary = truck.getSchedules().stream()
                .filter(Schedule::isNowActive)
                .max(Comparator.comparing(Schedule::getStartTime)) // 여러개라면 최근 시작 스케줄 선택
                .map(Schedule::getLocationName)
                .orElse("현재 운영하지 않음");

        return new TruckDetailResponseDto(
                truck.getId(),
                truck.getOwner().getId(),
                truck.getName(),
                truck.getCuisine(),
                truck.getStatus(),
                truck.getCreatedAt(),
                truck.getUpdatedAt(),
                schedules,
                menu,
                locationSummary
        );
    }
}
