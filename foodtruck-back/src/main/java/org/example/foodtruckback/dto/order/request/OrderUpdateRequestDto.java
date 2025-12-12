package org.example.foodtruckback.dto.order.request;

import jakarta.validation.constraints.NotNull;
import org.example.foodtruckback.dto.orderItem.request.CreateOrderItemRequestDto;
import org.example.foodtruckback.dto.orderItem.request.UpdateOrderItemRequestDto;

import java.util.List;

public record OrderUpdateRequestDto(
        @NotNull
        List<UpdateOrderItemRequestDto> items
) {
}
