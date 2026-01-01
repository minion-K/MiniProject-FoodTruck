package org.example.foodtruckback.dto.reservation.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public record ReservationCreateRequestDto(
        @NotNull(message = "선택한 트럭의 일정을 확인하세요.")
        Long scheduleId,

        @NotNull(message = "픽업 예정 시간을 정해주세요.")
        LocalDateTime pickupTime,

        @NotNull(message = "예약 메뉴를 선택해주세요")
        @Size(min = 1)
        List<ReservationMenuItemRequestDto> menuItems,

        @Size(max = 255)
        String note
) {}
