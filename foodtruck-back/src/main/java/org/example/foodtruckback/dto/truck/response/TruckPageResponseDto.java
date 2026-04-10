package org.example.foodtruckback.dto.truck.response;

import java.util.List;

public record TruckPageResponseDto(
        List<TruckListItemResponseDto> content,
        int totalPage,
        long totalElement,
        int number
) {}
