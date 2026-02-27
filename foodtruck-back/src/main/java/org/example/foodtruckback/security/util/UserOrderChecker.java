package org.example.foodtruckback.security.util;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.enums.ReservationStatus;
import org.example.foodtruckback.entity.order.Order;
import org.example.foodtruckback.repository.order.OrderRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component("userOrderAuthz")
public class UserOrderChecker {
    private final OrderRepository orderRepository;

    public boolean canChangeOrder(Long orderId, Authentication principal) {
        if(orderId == null || principal == null) return false;

        String loginId = principal.getName();

        Order order = orderRepository.findById(orderId).orElse(null);
        if(order == null) return false;

        if(order.getUser() != null && order.getUser().getLoginId().equals((loginId))) return true;

        if(order.getReservation() != null &&
                order.getReservation().getUser() != null &&
                order.getReservation().getUser().getLoginId().equals(loginId)
        ) {

            return true;
        }

        return false;
    }
}