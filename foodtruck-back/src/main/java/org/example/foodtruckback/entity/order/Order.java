package org.example.foodtruckback.entity.order;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.foodtruckback.common.enums.OrderSource;
import org.example.foodtruckback.common.enums.OrderStatus;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.entity.base.BaseTimeEntity;
import org.example.foodtruckback.entity.reservation.Reservation;
import org.example.foodtruckback.entity.truck.Schedule;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "orders",
        indexes = {
                @Index(name = "idx_orders_schedule", columnList = "schedule_id, status"),
                @Index(name = "idx_orders_user", columnList = "user_id, paid_at")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order extends BaseTimeEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "schedule_id",
            foreignKey = @ForeignKey(name = "fk_order_truck_schedule"), nullable = false)
    private Schedule schedule;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "fk_order_user"))
    private User user;

    @Column(name = "source", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private OrderSource source = OrderSource.ONSITE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", foreignKey = @ForeignKey(name = "fk_order_reservation"))
    private Reservation reservation;

    @Column(name = "amount", nullable = false)
    private int amount;

    @Column(name = "currency", nullable = false, columnDefinition = "CHAR(3)")
    private String currency = "KRW";

    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;
}
