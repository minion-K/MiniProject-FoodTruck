package org.example.foodtruckback.dto.reservation.response;

import java.util.List;

public record AdminReservationPageResponseDto(
        List<AdminReservationListResponseDto> content,
        int totalPage,
        long totalElement,
        int number
) {
}
