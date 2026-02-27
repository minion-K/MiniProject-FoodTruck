package org.example.foodtruckback.controller.order;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.constants.order.OrderApi;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.order.request.OrderCreateRequestDto;
import org.example.foodtruckback.dto.order.request.OrderUpdateRequestDto;
import org.example.foodtruckback.dto.order.response.AdminOrderListResponseDto;
import org.example.foodtruckback.dto.order.response.OrderDetailResponseDto;
import org.example.foodtruckback.dto.order.response.OwnerOrderListResponseDto;
import org.example.foodtruckback.dto.order.response.UserOrderListResponseDto;
import org.example.foodtruckback.security.user.UserPrincipal;
import org.example.foodtruckback.service.order.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(OrderApi.ROOT)
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    // create order
    @PostMapping()
    public ResponseEntity<ResponseDto<OrderDetailResponseDto>> createOrder(
            @Valid @RequestBody OrderCreateRequestDto request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ResponseDto<OrderDetailResponseDto> response = orderService.createOrder(request, principal);

        return ResponseEntity.ok().body(response);
    }

    // get order (all) - user
    @GetMapping(OrderApi.ME)
    public ResponseEntity<ResponseDto<List<UserOrderListResponseDto>>> getMyOrders(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ResponseDto<List<UserOrderListResponseDto>> response = orderService.getMyOrders(principal);

        return ResponseEntity.ok().body(response);
    }

    //get order (all) - owner
    @GetMapping(OrderApi.TRUCK)
    public ResponseEntity<ResponseDto<List<OwnerOrderListResponseDto>>> getTruckOrders(
            @PathVariable Long truckId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ResponseDto<List<OwnerOrderListResponseDto>> response = orderService.getTruckOrders(truckId, principal);

        return ResponseEntity.ok().body(response);
    }

    // get order (all) - admin
    @GetMapping
    public ResponseEntity<ResponseDto<List<AdminOrderListResponseDto>>> getAllOrders() {
        ResponseDto<List<AdminOrderListResponseDto>> response = orderService.getAllOrders();

        return ResponseEntity.ok().body(response);
    }

    @GetMapping(OrderApi.BY_ID)
    public ResponseEntity<ResponseDto<OrderDetailResponseDto>> getOrderById(
            @PathVariable Long orderId
    ) {
        ResponseDto<OrderDetailResponseDto> response = orderService.getOrderById(orderId);

        return ResponseEntity.ok().body(response);
    }

    // update order
    @PutMapping(OrderApi.BY_ID)
    public ResponseEntity<ResponseDto<OrderDetailResponseDto>> updateOrder(
            @PathVariable Long orderId,
            @Valid @RequestBody OrderUpdateRequestDto request
    ) {
        ResponseDto<OrderDetailResponseDto> response = orderService.updateOrder(orderId, request);

        return ResponseEntity.ok().body(response);
    }

    // cancel order (상태 변경)
    @PutMapping(OrderApi.CANCEL)
    public ResponseEntity<ResponseDto<Void>> cancelOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ResponseDto<Void> response = orderService.cancelOrder(orderId, principal);

        return ResponseEntity.ok().body(response);
    }

    // refund order
    @PutMapping(OrderApi.REFUND)
    public ResponseEntity<ResponseDto<Void>> refundOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ResponseDto<Void> response = orderService.refundOrder(orderId, principal);

        return ResponseEntity.ok().body(response);
    }
}