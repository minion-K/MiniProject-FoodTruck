package org.example.foodtruckback.dto.order.response;

import java.util.List;

public record OwnerOrderPageResponseDto(
        List<OwnerOrderListResponseDto> content,
        int totalPage,
        long totalElement,
        int number
) {}
