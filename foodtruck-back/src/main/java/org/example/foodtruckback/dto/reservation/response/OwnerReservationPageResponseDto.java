package org.example.foodtruckback.dto.reservation.response;

import java.util.List;

public record OwnerReservationPageResponseDto(
        List<OwnerReservationListResponseDto> content,
        int totalPage,
        long totalElement,
        int number
) {
}
