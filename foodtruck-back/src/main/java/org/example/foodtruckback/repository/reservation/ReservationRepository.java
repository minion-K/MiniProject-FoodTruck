package org.example.foodtruckback.repository.reservation;

import io.lettuce.core.dynamic.annotation.Param;
import jakarta.validation.constraints.NotNull;
import org.example.foodtruckback.common.enums.ReservationStatus;
import org.example.foodtruckback.entity.reservation.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation,Long> {
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

    @Query(value = """
        SELECT r
        FROM Reservation r
        JOIN r.schedule s
        JOIN s.truck t
        JOIN s.location l
        WHERE r.user.id = :userId
            AND (:status IS NULL OR r.status = :status)
            AND (:keyword IS NULL OR t.name LIKE %:keyword%)
        ORDER BY r.createdAt DESC
    """,
    countQuery = """
        SELECT COUNT(r)
        FROM Reservation r
        JOIN r.schedule s
        JOIN s.truck t
        WHERE r.user.id = :userId
            AND (:status IS NULL OR r.status = :status)
            AND (:keyword IS NULL OR t.name LIKE %:keyword%)
    """)
    Page<Reservation> findForUserReservations(@Param("userId") Long userId, Pageable pageable, String keyword, ReservationStatus status);

    //    TODO: menuItems N + 1 최적화 필요(IN 쿼리)
    @Query(value = """
        SELECT r
        FROM Reservation r
        JOIN FETCH r.user u
        JOIN FETCH r.schedule s
        JOIN FETCH s.truck t
        WHERE (:status IS NULL OR r.status = :status)
            AND (:keyword IS NULL OR u.name LIKE %:keyword% OR t.name LIKE %:keyword%)
            AND (:startDate IS NULL OR r.createdAt >= :startDate)
            AND (:endDate IS NULL OR r.createdAt <= :endDate)
    """,
    countQuery = """
        SELECT COUNT(r)
        FROM Reservation r
        JOIN r.user u
        JOIN r.schedule s
        JOIN s.truck t
        WHERE (:status IS NULL OR r.status = :status)
            AND (:keyword IS NULL OR u.name LIKE %:keyword% OR t.name LIKE %:keyword%)
            AND (:startDate IS NULL OR r.createdAt >= :startDate)
            AND (:endDate IS NULL OR r.createdAt <= :endDate)
    """)
    Page<Reservation> findAdminReservations(Pageable pageable, LocalDateTime startDate, LocalDateTime endDate, ReservationStatus status, String keyword);

    @Query(value = """
        SELECT DISTINCT r
        FROM Reservation r
        JOIN r.schedule s
        JOIN s.truck t
        WHERE s.id = :scheduleId
        ORDER BY r.createdAt DESC
    """,
    countQuery = """
        SELECT COUNT(DISTINCT r)
        FROM Reservation r
        JOIN r.schedule s
        WHERE s.id = :scheduleId
    """)
    Page<Reservation> findByScheduleId(@Param("scheduleId") Long scheduleId, Pageable pageable);

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


}