package org.example.foodtruckback.repository.payment;

import org.example.foodtruckback.entity.payment.PaymentRefund;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRefundRepository extends JpaRepository<PaymentRefund, Long> {
}
