package org.example.foodtruckback.dto.order.response;

import java.util.List;

public record AdminOrderPageResponseDto(
        List<AdminOrderListResponseDto> content,
        int totalPage,
        long totalElement,
        int number
) {
}
