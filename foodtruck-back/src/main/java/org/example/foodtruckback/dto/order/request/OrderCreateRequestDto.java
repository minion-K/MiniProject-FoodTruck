package org.example.foodtruckback.dto.order.request;

import jakarta.validation.constraints.NotNull;
import org.example.foodtruckback.common.enums.OrderSource;
import org.example.foodtruckback.dto.orderItem.request.CreateOrderItemRequestDto;
import java.util.List;

public record OrderCreateRequestDto(
        @NotNull
        Long scheduleId,
        Long userId,
        @NotNull
        OrderSource source,
        Long reservationId,
        @NotNull
        List<CreateOrderItemRequestDto> items
) {
}
