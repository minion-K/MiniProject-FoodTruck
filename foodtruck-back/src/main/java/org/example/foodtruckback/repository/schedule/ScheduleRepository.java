package org.example.foodtruckback.repository.schedule;

import jakarta.validation.constraints.NotNull;
import org.example.foodtruckback.entity.location.Location;
import org.example.foodtruckback.entity.truck.Schedule;
import org.example.foodtruckback.entity.truck.Truck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule,Long> {
    Collection<Schedule> findByTruckId(Long truckId);

    List<Schedule> findAllByTruck(Truck truck);

    @Query("""
        SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END
        FROM Schedule s
        WHERE  s.truck = :truck
            AND s.location = :location
            AND s.endTime > :startTime
            AND s.startTime < :endTime
    """)
    boolean existsByTruckAndLocationAndTimeOverlap(
            @Param("truck") Truck truck,
            @Param("location") Location location,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    @Query("""
        SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END
        FROM Schedule s
        WHERE  s.truck = :truck
            AND s.location = :location
            AND s.endTime > :startTime
            AND s.startTime < :endTime
            AND s.id <> :excludeId
    """)
    boolean existsByTruckAndLocationAndTimeOverlapExcludingSchedule(
            @Param("truck") Truck truck,
            @Param("location") Location location,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("excludeId") Long excludeId
    );

    @Query("""
        SELECT count(s) > 0
        FROM Schedule s
        WHERE s.location = :location
            and s.truck.owner.id <> :ownerId
    """)
    boolean existsByLocationAndOtherOwner(
            @Param("location") Location location,
            @Param("ownerId") Long ownerId
    );

    boolean existsByLocationId(Long locationId);

    boolean existsByTruckIdAndEndTimeAfter(Long truckId, LocalDateTime now);
}
