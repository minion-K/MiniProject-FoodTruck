package org.example.foodtruckback.entity.reservation;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.common.enums.ReservationStatus;
import org.example.foodtruckback.dto.reservation.request.ReservationMenuItemRequestDto;
import org.example.foodtruckback.entity.base.BaseTimeEntity;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.entity.truck.Schedule;
import org.example.foodtruckback.exception.BusinessException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "reservations",
        indexes = {
                @Index(name = "idx_resv_user_time", columnList = "user_id, pickup_time"),
                @Index(name = "idx_resv_schedule", columnList = "schedule_id, status"),
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Reservation extends BaseTimeEntity {
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "schedule_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_resv_schedule"))
        private Schedule schedule;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_resv_user"))
        private User user;

        @Column(nullable = false)
        private LocalDateTime pickupTime;

        @Column(nullable = false)
        private int totalAmount;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false, length = 20)
        private ReservationStatus status = ReservationStatus.PENDING;

        @Column(length = 255)
        private String note;

        @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<ReservationItem> menuItems = new ArrayList<>();

        public static Reservation createReservation(
                User user, Schedule schedule, LocalDateTime pickupTime, int totalAmount, String note
        ) {
                Reservation reservation = new Reservation();
                reservation.user = user;
                reservation.schedule = schedule;
                reservation.pickupTime = pickupTime;
                reservation.totalAmount = totalAmount;
                reservation.note = note;
                reservation.status = ReservationStatus.PENDING;
                return reservation;
        }

        public void updateStatus(ReservationStatus newStatus, String note) {
                if(this.status == ReservationStatus.CANCELED) {
                        throw new BusinessException(ErrorCode.INVALID_RESERVATION_STATUS);
                }

                if(this.status == newStatus) {
                        throw new BusinessException(ErrorCode.INVALID_RESERVATION_STATUS);
                }

                boolean valid = switch (this.status) {
                        case PENDING -> newStatus == ReservationStatus.CONFIRMED
                                || newStatus == ReservationStatus.CANCELED;
                        case CONFIRMED -> newStatus == ReservationStatus.CANCELED;
                        default -> false;
                };

                if(!valid) {
                        throw new BusinessException(ErrorCode.INVALID_RESERVATION_STATUS);
                }

                this.status = newStatus;
                if (note != null) {
                        this.note = note;
                }
        }

        public void addMenuItem(ReservationItem item) {
                this.menuItems.add(item);
        }

        public void cancelByUser() {
                if(this.status != ReservationStatus.PENDING) {
                        throw new BusinessException(ErrorCode.INVALID_RESERVATION_STATUS);
                }

                this.status = ReservationStatus.CANCELED;
                this.note = "사용자 취소";
        }

        public void updateContent(
                LocalDateTime pickupTime,
                String note,
                int totalAmount,
                List<ReservationItem> menuItems
        ) {
                if(this.status != ReservationStatus.PENDING) {
                        throw new BusinessException(ErrorCode.INVALID_RESERVATION_STATUS);
                }

                this.pickupTime = pickupTime;
                this.note = note;
                this.totalAmount = totalAmount;

                this.menuItems.clear();
                this.menuItems.addAll(menuItems);
        }
}
