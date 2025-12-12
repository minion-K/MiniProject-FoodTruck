package org.example.foodtruckback.dto.reservation.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record ReservationCreateRequestDto(
        @NotNull(message = "선택한 트럭의 일정을 확인하세요.")
        Long scheduleId,

        @NotNull(message = "픽업 예정 시간을 정해주세요.")
        LocalDateTime pickupTime,

        @NotNull(message = "구매 금액을 확인하세요.")
        int totalAmount,

        @Size(max = 255)
        String note
) {}
