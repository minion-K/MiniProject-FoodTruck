package org.example.foodtruckback.service.order;

import jakarta.validation.Valid;
import org.example.foodtruckback.common.enums.OrderSource;
import org.example.foodtruckback.common.enums.OrderStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.order.request.OrderCreateRequestDto;
import org.example.foodtruckback.dto.order.request.OrderUpdateRequestDto;
import org.example.foodtruckback.dto.order.response.*;
import org.example.foodtruckback.security.user.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {

    ResponseDto<OrderDetailResponseDto> createOrder(@Valid OrderCreateRequestDto request, UserPrincipal principal);

    ResponseDto<List<UserOrderListResponseDto>> getMyOrders(UserPrincipal principal);

    ResponseDto<OwnerOrderPageResponseDto> getTruckOrders(Long scheduleId, Long ownerId, Pageable pageable);

    ResponseDto<AdminOrderPageResponseDto> getAllOrders(Long adminId, Pageable pageable, String dateRange, OrderStatus status, String keyword, OrderSource source);

    ResponseDto<OrderDetailResponseDto> updateOrder(Long orderId, @Valid OrderUpdateRequestDto request);

    ResponseDto<Void> cancelOrder(Long orderId, UserPrincipal principal);

    ResponseDto<Void> refundOrder(Long orderId, UserPrincipal principal);

    ResponseDto<OrderDetailResponseDto> getOrderById(Long orderId);
}