package org.example.foodtruckback.dto.truck.response;

import org.example.foodtruckback.common.enums.TruckStatus;
import org.example.foodtruckback.entity.truck.Schedule;
import org.example.foodtruckback.entity.truck.Truck;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;

public record TruckListItemResponseDto(
        Long id,
        String name,
        String cuisine,
        TruckStatus status,
        String locationSummary,
        BigDecimal latitude,
        BigDecimal longitude,
        String ownerName,
        String ownerLoginId,
        LocalDateTime createdAt,
        boolean isActive
) {

   public static TruckListItemResponseDto from(Truck truck) {

       Schedule activeSchedule = truck.getSchedules().stream()
               .filter(Schedule::isNowActive)
               .findFirst()
               .orElse(null);

       Schedule lastestSchedule = truck.getSchedules().stream()
               .filter(schedule -> schedule.getLocation() != null)
               .findFirst()
               .orElse(null);

       Schedule target = activeSchedule != null ? activeSchedule : lastestSchedule;

       boolean isOpen = activeSchedule != null;
       String locationSummary = "위치 정보 없음";
       BigDecimal latitude = null;
       BigDecimal longitude = null;

       if(target != null && target.getLocation() != null) {
           locationSummary = isOpen
                   ? target.getLocationName()
                   : "현재 영업 중이 아닙니다.";
           latitude = target.getLocation().getLatitude();
           longitude = target.getLocation().getLongitude();

       }

       return new TruckListItemResponseDto(
               truck.getId(),
               truck.getName(),
               truck.getCuisine(),
               truck.getStatus(),
               locationSummary,
               latitude,
               longitude,
               truck.getOwner().getName(),
               truck.getOwner().getLoginId(),
               truck.getCreatedAt(),
               isOpen
       );
   }
}
