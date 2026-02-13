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

    public Schedule(
            Truck truck,
            LocalDateTime startTime,
            LocalDateTime endTime,
            Location location,
            Integer maxReservations
    ) {
        validDateCreateTime(startTime, endTime);

        this.truck = truck;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
        this.maxReservations = maxReservations != null ? maxReservations : 100;
    }

    private void validDateCreateTime(
            LocalDateTime start,
            LocalDateTime end
    ) {
        LocalDateTime now = LocalDateTime.now();

        if(start == null || end == null) {
            throw new BusinessException(ErrorCode.MISSING_TIME);
        }

        if(!start.isBefore(end)) {
            throw new BusinessException(ErrorCode.INVALID_SCHEDULE_REQUEST);
        }

        if(start.isBefore(now)) {
            throw new BusinessException(ErrorCode.INVALID_SCHEDULE_REQUEST);
        }
    }

    public boolean isNowActive() {
        return getCurrentStatus() == ScheduleStatus.OPEN;
    }

    public String getLocationName() {
        return location != null ? location.getName() : "위치 미정";
    }

    public boolean isReservation() {
        return getCurrentStatus() == ScheduleStatus.OPEN;
    }
    public void setTruck(Truck truck) {
        this.truck = truck;
    }

    public void updateSchedule(
            LocalDateTime startTime,
            LocalDateTime endTime,
            Integer maxReservations,
            Location location
    ) {
        LocalDateTime now = LocalDateTime.now();

        LocalDateTime start = startTime != null ? startTime : this.startTime;
        LocalDateTime end = endTime != null ? endTime : this.endTime;

        if(!start.isBefore(end)) {
            throw new BusinessException(ErrorCode.INVALID_SCHEDULE_REQUEST);
        }

        if(now.isAfter(this.endTime) || now.isEqual(this.endTime)) {
            throw new BusinessException(ErrorCode.INVALID_SCHEDULE_STATUS);
        }

        if((now.isAfter(this.startTime)
                || now.isEqual(this.startTime))
                && startTime != null
                && !startTime.equals(this.startTime)
        ) {
            throw new BusinessException(ErrorCode.INVALID_SCHEDULE_STATUS);
        }

        if(endTime != null && endTime.isBefore(now)) {
            throw new BusinessException(ErrorCode.INVALID_SCHEDULE_REQUEST);
        }

        this.startTime = start;
        this.endTime = end;

        if(maxReservations != null) {
            this.maxReservations = maxReservations;
        }

        if(location != null) {
            this.location = location;
        }
    }

    public void changeStatus(ScheduleStatus newStatus) {
        if(newStatus == null) {
            throw new BusinessException(ErrorCode.INVALID_SCHEDULE_REQUEST);
        }

        LocalDateTime now = LocalDateTime.now();

        if((now.isAfter(endTime) || now.isEqual(endTime))
            && newStatus == ScheduleStatus.OPEN
        ) {
            throw new BusinessException(ErrorCode.INVALID_SCHEDULE_STATUS);
        }

        if((now.isAfter(startTime) || now.isEqual(startTime))
            && newStatus == ScheduleStatus.PLANNED
        ) {
            throw new BusinessException(ErrorCode.INVALID_SCHEDULE_STATUS);
        }

        this.status = newStatus;
    }

    public ScheduleStatus getCurrentStatus() {
        if(this.status == ScheduleStatus.CANCELED) {
            return ScheduleStatus.CANCELED;
        }

        LocalDateTime now = LocalDateTime.now();

        if(now.isAfter(endTime) || now.isEqual(endTime)) {
            return ScheduleStatus.CLOSED;
        }

        if(now.isAfter(startTime) || now.isEqual(startTime)) {
            return ScheduleStatus.OPEN;
        }

        return ScheduleStatus.PLANNED;
    }
}
