package org.example.foodtruckback.dto.truck.response;

import org.example.foodtruckback.common.enums.TurckStatus;
import org.example.foodtruckback.entity.truck.Schedule;
import org.example.foodtruckback.entity.truck.Truck;

import java.util.Comparator;

public record TruckListItemResponseDto(
        Long id,
        String name,
        String cuisine,
        TurckStatus status,
        String locationSummary
) {

   public static TruckListItemResponseDto from(Truck truck) {

       String locationSummary = truck.getSchedules().stream()
               .filter(Schedule::isNowActive)
               .max(Comparator.comparing(Schedule::getStartTime))
               .map(Schedule::getLocationName)
               .orElse("현재 운영하지 않습니다.");

       return new TruckListItemResponseDto(
               truck.getId(),
               truck.getName(),
               truck.getCuisine(),
               truck.getStatus(),
               locationSummary
       );
   }
}
