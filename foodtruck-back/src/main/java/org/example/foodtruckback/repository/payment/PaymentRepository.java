package org.example.foodtruckback.repository.payment;

import jakarta.validation.constraints.NotBlank;
import org.example.foodtruckback.common.enums.PaymentStatus;
import org.example.foodtruckback.entity.payment.Payment;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.security.user.UserPrincipalMapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserOrderByCreatedAtDesc(User user);

    Optional<Payment> findTopByProductCodeOrderByCreatedAt(String productCode);

    boolean existsByProductCodeAndStatus(@NotBlank(message = "상품 코드는 필수입니다.") String s, PaymentStatus paymentStatus);
}
