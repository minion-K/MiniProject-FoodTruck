package org.example.foodtruckback.service.order;

import jakarta.validation.Valid;
import org.example.foodtruckback.common.enums.OrderSource;
import org.example.foodtruckback.common.enums.OrderStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.order.request.OrderCreateRequestDto;
import org.example.foodtruckback.dto.order.request.OrderUpdateRequestDto;
import org.example.foodtruckback.dto.order.response.*;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface OrderService {
    ResponseDto<OrderDetailResponseDto> createOrder(@Valid OrderCreateRequestDto request);

    ResponseDto<List<UserOrderListResponseDto>> getMyOrders();

    ResponseDto<OwnerOrderPageResponseDto> getTruckOrders(Long scheduleId, Pageable pageable);

    ResponseDto<AdminOrderPageResponseDto> getAllOrders(Pageable pageable, String dateRange, OrderStatus status, String keyword, OrderSource source);

    ResponseDto<OrderDetailResponseDto> updateOrder(Long orderId, @Valid OrderUpdateRequestDto request);

    ResponseDto<Void> cancelOrder(Long orderId);

    ResponseDto<Void> refundOrder(Long orderId);

    ResponseDto<OrderDetailResponseDto> getOrderById(Long orderId);

    ResponseDto<Void> payOrder(Long orderId);
}