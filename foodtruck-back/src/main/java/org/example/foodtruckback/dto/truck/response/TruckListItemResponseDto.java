package org.example.foodtruckback.dto.truck.response;

import org.example.foodtruckback.common.enums.TruckStatus;
import org.example.foodtruckback.entity.truck.Schedule;
import org.example.foodtruckback.entity.truck.Truck;

import java.math.BigDecimal;
import java.util.Comparator;

public record TruckListItemResponseDto(
        Long id,
        String name,
        String cuisine,
        TruckStatus status,
        String locationSummary,
        BigDecimal latitude,
        BigDecimal longitude
) {

   public static TruckListItemResponseDto from(Truck truck) {

       Schedule activeSchedule = truck.getSchedules().stream()
               .filter(Schedule::isNowActive)
               .max(Comparator.comparing(Schedule::getStartTime))
               .orElse(null);

       if(activeSchedule == null || activeSchedule.getLocation() == null) {
           return new TruckListItemResponseDto(
                   truck.getId(),
                   truck.getName(),
                   truck.getCuisine(),
                   truck.getStatus(),
                   "현재 운영하지 않습니다.",
                   null,
                   null
           );
       }

       return new TruckListItemResponseDto(
               truck.getId(),
               truck.getName(),
               truck.getCuisine(),
               truck.getStatus(),
               activeSchedule.getLocation().getName(),
               activeSchedule.getLocation().getLatitude(),
               activeSchedule.getLocation().getLongitude()
       );
   }
}
