package org.example.foodtruckback.repository.reservation;

import io.lettuce.core.dynamic.annotation.Param;
import jakarta.validation.constraints.NotNull;
import org.example.foodtruckback.common.enums.ReservationStatus;
import org.example.foodtruckback.entity.reservation.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation,Long> {
    List<Reservation> findByUserId(Long id);

    boolean existsByUser_IdAndSchedule_IdAndPickupTimeAndStatusIn(
            Long userId,
            Long ScheduleId,
            @NotNull(message = "픽업 예정 시간을 선택해주세요.") LocalDateTime localDateTime,
            List<ReservationStatus> status
    );

    boolean existsByUser_IdAndSchedule_IdAndPickupTimeAndStatusInAndIdNot(
            Long userId,
            Long ScheduleId,
            @NotNull(message = "픽업 예정 시간을 선택해주세요.") LocalDateTime localDateTime,
            List<ReservationStatus> status,
            Long reservationId

    );

    @Query("SELECT DISTINCT r" +
            " FROM Reservation r" +
            " JOIN FETCH r.schedule s" +
            " JOIN FETCH s.truck t " +
            "JOIN FETCH s.location l " +
            "WHERE r.user.id = :userId " +
            "ORDER BY r.createdAt DESC")
    List<Reservation> findForUserReservationList(@Param("userId") Long userId);

    @Query("SELECT DISTINCT r" +
            " FROM Reservation r" +
            " JOIN FETCH r.schedule s" +
            " JOIN FETCH s.truck t " +
            "JOIN FETCH s.location l " +
            "ORDER BY r.createdAt DESC")
    List<Reservation> findForAdminReservationList();


    @Query("""
        SELECT r
        FROM Reservation r
        JOIN FETCH r.schedule s
        JOIN FETCH s.truck t
        JOIN FETCH s.location l
        LEFT JOIN FETCH r.menuItems m
        WHERE r.id = :reservationId
    """)
    Optional<Reservation> findDetail(@Param("reservationId") Long reservationId);

    @Query("""
        SELECT DISTINCT r
        FROM Reservation r
        JOIN FETCH r.schedule s
        JOIN FETCH s.truck t
        JOIN FETCH s.location l
        WHERE s.id = :scheduleId
        ORDER BY r.createdAt DESC
    """)
    List<Reservation> findByScheduleIdFetch(@Param("scheduleId") Long scheduleId);
}