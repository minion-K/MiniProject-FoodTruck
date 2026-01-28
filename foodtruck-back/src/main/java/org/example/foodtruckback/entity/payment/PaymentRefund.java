package org.example.foodtruckback.entity.payment;

import jakarta.persistence.*;
import lombok.*;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.common.enums.RefundStatus;
import org.example.foodtruckback.entity.base.BaseTimeEntity;
import org.example.foodtruckback.exception.BusinessException;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_refunds")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class PaymentRefund extends BaseTimeEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id",
            foreignKey = @ForeignKey(name = "fk_payment_refunds_payment"), nullable = false)
    private Payment payment;

    @Column(name = "amount", nullable = false)
    private Long amount;

    @Column(name = "reason", length = 255)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private RefundStatus status;

    @Column(name = "failure_code", length = 50)
    private String failureCode;

    @Column(name = "failure_message", length = 255)
    private String failureMessage;

    @CreationTimestamp
    @Column(name = "requested_at", nullable = false)
    private LocalDateTime requestedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public void markCompleted() {
        if(this.status != RefundStatus.REQUESTED) {
            throw new BusinessException(ErrorCode.PAYMENT_REFUNDED_NOT_ALLOWED);
        }

        this.status = RefundStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
        this.failureCode = null;
        this.failureMessage = null;
    }

    public void markFailed(String code, String message) {
        this.status = RefundStatus.FAILED;
        this.failureCode = code;
        this.failureMessage = message;
    }
}
