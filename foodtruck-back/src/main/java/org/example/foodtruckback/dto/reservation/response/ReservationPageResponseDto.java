package org.example.foodtruckback.dto.reservation.response;

import java.util.List;

public record ReservationPageResponseDto(
        List<ReservationListResponseDto> content,
        int totalPage,
        long totalElement,
        int number
) {
}
