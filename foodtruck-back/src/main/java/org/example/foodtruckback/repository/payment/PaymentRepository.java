package org.example.foodtruckback.repository.payment;

import jakarta.validation.constraints.NotBlank;
import org.example.foodtruckback.common.enums.PaymentStatus;
import org.example.foodtruckback.entity.payment.Payment;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.security.user.UserPrincipalMapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.swing.text.html.Option;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    @Query("""
        SELECT p
        FROM Payment p
        JOIN FETCH p.user
        WHERE p.user = :user
        ORDER BY p.createdAt DESC
    """)
    List<Payment> findByUserWithUser(@Param("user") User user);

    Optional<Payment> findTopByProductCodeOrderByCreatedAt(String productCode);

    Optional<Payment> findFirstByProductCodeAndStatus(String productCode, PaymentStatus paymentStatus);

    List<Payment> findByProductCodeAndStatus(String productCode, PaymentStatus paymentStatus);

    Optional<Payment> findByOrderId(Long orderId);

    List<Payment> findByProductCodeIn(Collection<String> productCodes);

    boolean existsByOrderIdAndStatus(Long orderId, PaymentStatus paymentStatus);

    boolean existsByProductCodeAndStatus(String productCode, PaymentStatus paymentStatus);
}
