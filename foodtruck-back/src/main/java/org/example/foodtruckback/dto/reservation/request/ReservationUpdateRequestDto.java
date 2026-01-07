package org.example.foodtruckback.dto.reservation.request;

import java.time.LocalDateTime;
import java.util.List;

public record ReservationUpdateRequestDto(
   LocalDateTime pickupTime,
   List<ReservationMenuItemRequestDto> menuItems,
   String note
) {}
