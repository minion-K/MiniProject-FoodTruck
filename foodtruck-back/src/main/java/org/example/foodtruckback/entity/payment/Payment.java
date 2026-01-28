package org.example.foodtruckback.entity.payment;

import jakarta.persistence.*;
import lombok.*;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.common.enums.PaymentMethod;
import org.example.foodtruckback.common.enums.PaymentStatus;
import org.example.foodtruckback.entity.base.BaseTimeEntity;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.exception.BusinessException;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "payments",
        indexes = {
                @Index(name = "idx_payments_user_id", columnList = "user_id"),
                @Index(name = "idx_payments_order_id", columnList = "order_id")
        },
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_payments_payment_key", columnNames = "payment_key"),
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Payment extends BaseTimeEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",
            foreignKey = @ForeignKey(name = "fk_payments_user"))
    private User user;

    @Column(name = "order_id", nullable = false, length = 100)
    private String orderId;

    @Column(name = "payment_key", nullable = false, length = 100)
    private String paymentKey;

    @Column(name = "amount", nullable = false)
    private Long amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "method", nullable = false, length = 30)
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private PaymentStatus status;

    @Column(name = "product_code", nullable = false, length = 50)
    private String productCode;

    @Column(name = "product_name", nullable = false, length = 100)
    private String productName;

    @Column(name = "failure_code", length = 50)
    private String failureCode;

    @Column(name = "failure_message", length = 255)
    private String failureMessage;

    @CreationTimestamp
    @Column(name = "requested_at", nullable = false, updatable = false)
    private LocalDateTime requestedAt;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    public void markSuccess() {
        if(this.status != PaymentStatus.READY) {
            throw new BusinessException(ErrorCode.PAYMENT_ALREADY_PROCESSED);
        }

        this.status = PaymentStatus.SUCCESS;
        this.approvedAt = LocalDateTime.now();
        this.failureCode = null;
        this.failureMessage = null;
    }

    public void markFailed(String code, String message) {
        this.status = PaymentStatus.FAILED;
        this.failureCode = code;
        this.failureMessage = message;
    }

    public void markRefunded() {
        this.status = PaymentStatus.REFUNDED;
        this.cancelledAt = LocalDateTime.now();
    }
}
