package org.example.foodtruckback.repository.payment;

import jakarta.validation.constraints.NotBlank;
import org.example.foodtruckback.common.enums.PaymentStatus;
import org.example.foodtruckback.entity.payment.Payment;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.security.user.UserPrincipalMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.swing.text.html.Option;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    @Query(value = """
        SELECT p
        FROM Payment p
        JOIN  p.user u
        WHERE p.user = :user
            AND(:status IS NULL OR p.status = :status)
            AND(:keyword IS NULL OR p.productName LIKE %:keyword%)
        ORDER BY p.createdAt DESC
    """,
    countQuery = """
        SELECT count(p)
        FROM Payment p
        WHERE p.user = :user
            AND(:status IS NULL OR p.status = :status)
            AND(:keyword IS NULL OR p.productName LIKE %:keyword%)
    """)
    Page<Payment> findByUserWithUser(@Param("user") User user, Pageable pageable, String keyword, PaymentStatus status);

    Optional<Payment> findTopByProductCodeOrderByCreatedAt(String productCode);

    Optional<Payment> findFirstByProductCodeAndStatus(String productCode, PaymentStatus paymentStatus);

    List<Payment> findByProductCodeAndStatus(String productCode, PaymentStatus paymentStatus);

    Optional<Payment> findByOrderId(Long orderId);

    List<Payment> findByProductCodeIn(Collection<String> productCodes);

    boolean existsByOrderIdAndStatus(Long orderId, PaymentStatus paymentStatus);

    boolean existsByProductCodeAndStatus(String productCode, PaymentStatus paymentStatus);
}
