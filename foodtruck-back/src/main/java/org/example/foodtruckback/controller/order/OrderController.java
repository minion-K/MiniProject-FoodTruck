package org.example.foodtruckback.controller.order;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.constants.order.OrderApi;
import org.example.foodtruckback.common.enums.OrderSource;
import org.example.foodtruckback.common.enums.OrderStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.order.request.OrderCreateRequestDto;
import org.example.foodtruckback.dto.order.request.OrderUpdateRequestDto;
import org.example.foodtruckback.dto.order.response.*;
import org.example.foodtruckback.service.order.OrderService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
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
            @Valid @RequestBody OrderCreateRequestDto request
    ) {
        ResponseDto<OrderDetailResponseDto> response = orderService.createOrder(request);

        return ResponseEntity.ok().body(response);
    }

    // get order (all) - user
    @GetMapping(OrderApi.ME)
    public ResponseEntity<ResponseDto<List<UserOrderListResponseDto>>> getMyOrders() {
        ResponseDto<List<UserOrderListResponseDto>> response = orderService.getMyOrders();

        return ResponseEntity.ok().body(response);
    }

    //get order (all) - owner
    @GetMapping(OrderApi.OWNER)
    public ResponseEntity<ResponseDto<OwnerOrderPageResponseDto>> getTruckOrders(
            @RequestParam Long scheduleId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);

        ResponseDto<OwnerOrderPageResponseDto> response = orderService.getTruckOrders(scheduleId, pageable);

        return ResponseEntity.ok().body(response);
    }

    // get order (all) - admin
    @GetMapping
    public ResponseEntity<ResponseDto<AdminOrderPageResponseDto>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String dateRange,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) OrderSource source
            ) {
        Pageable pageable = PageRequest.of(page, size);

        ResponseDto<AdminOrderPageResponseDto> response = orderService.getAllOrders(
                pageable, dateRange, status, keyword, source
        );

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
            @PathVariable Long orderId
    ) {
        ResponseDto<Void> response = orderService.cancelOrder(orderId);

        return ResponseEntity.ok().body(response);
    }

    // refund order
    @PutMapping(OrderApi.REFUND)
    public ResponseEntity<ResponseDto<Void>> refundOrder(
            @PathVariable Long orderId
    ) {
        ResponseDto<Void> response = orderService.refundOrder(orderId);

        return ResponseEntity.ok().body(response);
    }

    @PutMapping(OrderApi.PAY)
    public ResponseEntity<ResponseDto<Void>> payOrder(
            @PathVariable Long orderId
    ) {
        ResponseDto<Void> response = orderService.payOrder(orderId);

        return ResponseEntity.ok().body(response);
    }

}