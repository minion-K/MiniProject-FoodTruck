package org.example.foodtruckback.security.util;

import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.entity.order.Order;
import org.example.foodtruckback.entity.truck.Truck;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.repository.order.OrderRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component("ownerOrderAuthz")
public class OwnerOrderChecker {
    private final OrderRepository orderRepository;
    private final AuthorizationChecker authorizationChecker;

    public boolean canChangeOrder(Long orderId) {
        User user = authorizationChecker.getCurrentUser();

        if(orderId == null || user == null) return false;

        Order order = orderRepository.findById(orderId).orElse(null);
        if(order == null || order.getSchedule() == null) return false;

        Truck truck = order.getSchedule().getTruck();
        if(truck == null || truck.getOwner() == null) return false;

        return truck.getOwner().getId().equals(user.getId());
    }
}