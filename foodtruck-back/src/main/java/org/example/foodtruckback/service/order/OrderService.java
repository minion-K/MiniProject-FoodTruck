package org.example.foodtruckback.service.order;

import jakarta.validation.Valid;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.order.request.OrderCreateRequestDto;
import org.example.foodtruckback.dto.order.request.OrderUpdateRequestDto;
import org.example.foodtruckback.dto.order.response.AdminOrderListResponseDto;
import org.example.foodtruckback.dto.order.response.OrderDetailResponseDto;
import org.example.foodtruckback.dto.order.response.OwnerOrderListResponseDto;
import org.example.foodtruckback.dto.order.response.UserOrderListResponseDto;
import org.example.foodtruckback.security.user.UserPrincipal;

import java.util.List;

public interface OrderService {

    ResponseDto<OrderDetailResponseDto> createOrder(@Valid OrderCreateRequestDto request, UserPrincipal principal);

    ResponseDto<List<UserOrderListResponseDto>> getMyOrders(UserPrincipal principal);

    ResponseDto<List<OwnerOrderListResponseDto>> getTruckOrders(Long truckId, UserPrincipal principal);

    ResponseDto<List<AdminOrderListResponseDto>> getAllOrders();

    ResponseDto<OrderDetailResponseDto> updateOrder(Long orderId, @Valid OrderUpdateRequestDto request);

    ResponseDto<Void> cancelOrder(Long orderId, UserPrincipal principal);

    ResponseDto<Void> refundOrder(Long orderId, UserPrincipal principal);

    ResponseDto<OrderDetailResponseDto> getOrderById(Long orderId);
}