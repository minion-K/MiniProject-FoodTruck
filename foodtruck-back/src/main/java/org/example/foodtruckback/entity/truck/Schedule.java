package org.example.foodtruckback.entity.truck;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.common.enums.ScheduleStatus;
import org.example.foodtruckback.entity.base.BaseTimeEntity;
import org.example.foodtruckback.entity.location.Location;
import org.example.foodtruckback.exception.BusinessException;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "truck_schedules",
        indexes = {
                @Index(name = "idx_schedule_time", columnList = "start_time, end_time"),
                @Index(name = "idx_schedule_truck", columnList = "truck_id, status"),
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Schedule extends BaseTimeEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "truck_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_truck_schedules_turck_id"))
    private Truck truck;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_truck_schedules_location_id"))
    private Location location;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ScheduleStatus status = ScheduleStatus.PLANNED;

    @Column(name = "max_reservations", nullable = false)
    private int maxReservations = 100;

    public Schedule(Truck truck, LocalDateTime startTime, LocalDateTime endTime, Location location, Integer maxReservations) {
        this.truck = truck;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
        this.maxReservations = maxReservations != null ? maxReservations : 100;
        this.status = ScheduleStatus.PLANNED;
    }
    public boolean isNowActive() {
        LocalDateTime now = LocalDateTime.now();
        return !now.isBefore(startTime) && !now.isAfter(endTime)
                && status == ScheduleStatus.OPEN;
    }

    public String getLocationName() {
        return location != null ? location.getName() : "위치 미정";
    }

    public boolean isReservation() {
        return status == ScheduleStatus.OPEN
                && LocalDateTime.now().isBefore(endTime);
    }

    public void validate(LocalDateTime pickupTime) {
        if(pickupTime.isBefore(startTime) || pickupTime.isAfter(endTime)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
    }

    public void setTruck(Truck truck) {
        this.truck = truck;
    }
}
