package org.example.foodtruckback.repository.payment;

import org.example.foodtruckback.entity.payment.Payment;
import org.example.foodtruckback.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserOrderByCreatedAtDesc(User user);
}
