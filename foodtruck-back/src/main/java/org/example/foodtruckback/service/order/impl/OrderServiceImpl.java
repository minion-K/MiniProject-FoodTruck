package org.example.foodtruckback.service.order.impl;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.common.enums.OrderSource;
import org.example.foodtruckback.common.enums.OrderStatus;
import org.example.foodtruckback.common.enums.PaymentStatus;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.order.request.OrderCreateRequestDto;
import org.example.foodtruckback.dto.order.request.OrderUpdateRequestDto;
import org.example.foodtruckback.dto.order.response.*;
import org.example.foodtruckback.dto.orderItem.request.CreateOrderItemRequestDto;
import org.example.foodtruckback.dto.orderItem.request.UpdateOrderItemRequestDto;
import org.example.foodtruckback.entity.order.Order;
import org.example.foodtruckback.entity.order.OrderItem;
import org.example.foodtruckback.entity.payment.Payment;
import org.example.foodtruckback.entity.reservation.Reservation;
import org.example.foodtruckback.entity.truck.MenuItem;
import org.example.foodtruckback.entity.truck.Schedule;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.exception.BusinessException;
import org.example.foodtruckback.repository.menuItem.MenuItemRepository;
import org.example.foodtruckback.repository.order.OrderRepository;
import org.example.foodtruckback.repository.payment.PaymentRepository;
import org.example.foodtruckback.repository.reservation.ReservationRepository;
import org.example.foodtruckback.repository.schedule.ScheduleRepository;
import org.example.foodtruckback.security.user.UserPrincipal;
import org.example.foodtruckback.service.order.OrderService;
import org.example.foodtruckback.service.payment.PaymentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final ScheduleRepository scheduleRepository;
    private final MenuItemRepository menuItemRepository;
    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentService paymentService;

    @Override
    @Transactional
    @PreAuthorize("hasRole('OWNER')")
    public ResponseDto<OrderDetailResponseDto> createOrder(
            OrderCreateRequestDto request, UserPrincipal principal
    ) {
        User user = null;
        Reservation reservation = null;

        Schedule schedule = scheduleRepository.findById(request.scheduleId())
                .orElseThrow(() -> new BusinessException(ErrorCode.SCHEDULE_NOT_FOUND));

        if(request.source() == OrderSource.RESERVATION) {
            if(request.reservationId() == null) {
                throw new BusinessException(ErrorCode.INVALID_INPUT);
            }

            reservation = reservationRepository.findById(request.reservationId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.RESERVATION_NOT_FOUND));

            if(!reservation.getSchedule().getId().equals(schedule.getId())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT);
            }

            user = reservation.getUser();
        }

        Order order = Order.builder()
                .schedule(schedule)
                .user(user)
                .source(request.source())
                .reservation(reservation)
                .status(OrderStatus.PENDING)
                .amount(0)
                .build();

        int totalAmount = 0;

        for(CreateOrderItemRequestDto item : request.menus()) {
            if(item.qty() <= 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT);
            }

            MenuItem menuItem = menuItemRepository.findById(item.menuItemId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.ENTITY_NOT_FOUND));

            if(menuItem.isSoldOut()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT);
            }

            if(!menuItem.getTruck().getId().equals(schedule.getTruck().getId())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT);
            }

            OrderItem orderItem = OrderItem.create(
                    menuItem.getId(),
                    menuItem.getName(),
                    menuItem.getPrice(),
                    item.qty()
            );

            order.addOrderItem(orderItem);
            totalAmount += menuItem.getPrice() * item.qty();
        }

        order.setAmount(totalAmount);
        Order saved = orderRepository.save(order);
        OrderDetailResponseDto response = OrderDetailResponseDto.from(saved);

        return ResponseDto.success("주문 생성 완료", response);
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public ResponseDto<List<UserOrderListResponseDto>> getMyOrders(UserPrincipal principal) {
        List<Order> orders = orderRepository.findByUserLoginIdFetch(principal.getLoginId());

        Map<String, PaymentStatus> paymentStatusMap = getPaymentStatus(orders);

        List<UserOrderListResponseDto> response = orders.stream()
                .map(order -> {
                    String productCode = getProductCode(order);
                    PaymentStatus paymentStatus = paymentStatusMap.get(productCode);

                    return UserOrderListResponseDto.from(order, paymentStatus);
                })
                .toList();

        return ResponseDto.success("회원용 주문 조회 완료", response);
    }

    @Override
    @PreAuthorize("@authz.isScheduleOwner(#scheduleId, #ownerId)")
    public ResponseDto<OwnerOrderPageResponseDto> getTruckOrders(
            Long scheduleId, Long ownerId, Pageable pageable
    ) {
        Page<Order> orderPage = orderRepository.findOwnerOrders(scheduleId, pageable);

        Map<String, PaymentStatus> paymentStatusMap = getPaymentStatus(orderPage.getContent());

        List<OwnerOrderListResponseDto> content = orderPage.stream()
                .map(order -> {
                    String productCode = getProductCode(order);

                    PaymentStatus paymentStatus = paymentStatusMap.get(productCode);

                    return OwnerOrderListResponseDto.from(order, paymentStatus);
                })
                .toList();

        OwnerOrderPageResponseDto response = new OwnerOrderPageResponseDto(
                content,
                orderPage.getTotalPages(),
                orderPage.getTotalElements(),
                orderPage.getNumber()
        );

        return ResponseDto.success("운영자용 주문 조회 완료", response);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDto<AdminOrderPageResponseDto> getAllOrders(
            Long adminId, Pageable pageable, String dateRange,
            OrderStatus status, String keyword, OrderSource source
    ) {
        LocalDateTime startDate = getStartDate(dateRange);
        LocalDateTime endDate = getEndDate();

        Page<Order> orderPage = orderRepository.findAdminOrders(pageable, startDate, endDate, status, keyword, source);

        Map<String, PaymentStatus> paymentStatusMap = getPaymentStatus(orderPage.getContent());

        List<AdminOrderListResponseDto> content = orderPage.stream()
                .map(order -> {
                    String productCode = getProductCode(order);

                    PaymentStatus paymentStatus = paymentStatusMap.get(productCode);

                    return AdminOrderListResponseDto.from(order, paymentStatus);
                }).toList();

        AdminOrderPageResponseDto response = new AdminOrderPageResponseDto(
                content,
                orderPage.getTotalPages(),
                orderPage.getTotalElements(),
                orderPage.getNumber()
        );

        return ResponseDto.success("관리자용 주문 조회 완료", response);
    }


    @Override
    @Transactional
    @PreAuthorize(
            "hasRole('ADMIN') " +
                    "or @ownerOrderAuthz.canChangeOrder(#orderId, authentication) "
    )
    public ResponseDto<OrderDetailResponseDto> updateOrder(
            Long orderId, OrderUpdateRequestDto request
    ) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND));

        if(order.getStatus() != OrderStatus.PENDING) {
            throw new BusinessException(ErrorCode.ORDER_STATUS_INVALID);
        }

        order.getOrderItems().clear();

        int totalAmount = 0;

        for(UpdateOrderItemRequestDto item: request.items()) {
            MenuItem menuItem = menuItemRepository.findById(item.menuItemId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.ENTITY_NOT_FOUND));

            if(menuItem.isSoldOut()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT);
            }

            if(!menuItem.getTruck().getId().equals(order.getSchedule().getTruck().getId())) {
                throw new BusinessException(ErrorCode.INVALID_INPUT);
            }

            if(item.qty() <= 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT);
            }

            OrderItem orderItem = OrderItem.create(
                    menuItem.getId(),
                    menuItem.getName(),
                    menuItem.getPrice(),
                    item.qty()
            );

            order.addOrderItem(orderItem);
            totalAmount += menuItem.getPrice() * item.qty();
        }

        order.setAmount(totalAmount);
        OrderDetailResponseDto response = OrderDetailResponseDto.from(order);

        return ResponseDto.success("주문 수정 완료", response);
    }

    @Override
    @PreAuthorize(
            "hasRole('ADMIN') " +
                    "or @ownerOrderAuthz.canChangeOrder(#orderId, authentication) "
    )
    public ResponseDto<OrderDetailResponseDto> getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND));

        String productCode = getProductCode(order);

        PaymentStatus paymentStatus =
                paymentRepository.findFirstByProductCodeOrderByCreatedAtDesc(productCode)
                        .map(Payment::getStatus)
                        .orElse(PaymentStatus.READY);

        OrderDetailResponseDto response = OrderDetailResponseDto.from(order, paymentStatus);

        return ResponseDto.success("주문 상세 조회 완료", response);
    }

    @Override
    @Transactional
    @PreAuthorize(
            "hasRole('ADMIN') " +
                    "or @ownerOrderAuthz.canChangeOrder(#orderId, authentication)"
    )
    public ResponseDto<Void> cancelOrder(Long orderId, UserPrincipal principal) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND));

        order.cancel();

        return ResponseDto.success("주문 취소 완료", null);
    }

    @Override
    @Transactional
    @PreAuthorize(
            "hasRole('ADMIN') " +
                    "or @ownerOrderAuthz.canChangeOrder(#orderId, authentication)"
    )
    public ResponseDto<Void> refundOrder(Long orderId, UserPrincipal principal) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND));

        Payment payment = paymentRepository.findByOrderId(orderId)
                        .orElseThrow(() -> new BusinessException(ErrorCode.PAYMENT_NOT_FOUND));

        paymentService.refundInternal(
                payment,
                payment.getAmount(),
                "운영자/관리자 취소"
        );
        order.refund();

        return ResponseDto.success("주문 환불 완료", null);
    }

    private Map<String, PaymentStatus> getPaymentStatus(List<Order> orders) {
        if(orders.isEmpty()) {
            return Collections.emptyMap();
        }

        List<String> productCodes = new ArrayList<>();

        for(Order order: orders) {
            if(order.getSource() == OrderSource.RESERVATION && order.getReservation() != null) {
                productCodes.add("RES-" + order.getReservation().getId());
            } else {
                productCodes.add("ORD-" + order.getId());
            }
        }

        return paymentRepository.findByProductCodeIn(productCodes).stream()
                .collect(Collectors.toMap(
                        Payment::getProductCode,
                        Payment::getStatus,
                        (existing, replacement) -> replacement
                ));
    }

    private String getProductCode(Order order) {
        String productCode;

        if(order.getSource() == OrderSource.RESERVATION && order.getReservation() != null) {
            productCode = "RES-" + order.getReservation().getId();
        } else {
            productCode = "ORD-" + order.getId();
        }

        return productCode;
    }

    private LocalDateTime getStartDate(String dateRange) {
        if(dateRange == null || dateRange.equals("ALL")) return null;

        LocalDate today = LocalDate.now();

        return switch (dateRange) {
            case "TODAY" -> today.atStartOfDay();
            case "WEEK" -> today.with(DayOfWeek.MONDAY).atStartOfDay();
            case "MONTH" -> today.withDayOfMonth(1).atStartOfDay();
            default -> throw new BusinessException(ErrorCode.INVALID_INPUT);
        };
    }

    private LocalDateTime getEndDate() {
        return LocalDateTime.now();
    }
}