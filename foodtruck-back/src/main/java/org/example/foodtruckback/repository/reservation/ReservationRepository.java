package org.example.foodtruckback.repository.reservation;

import io.lettuce.core.dynamic.annotation.Param;
import jakarta.validation.constraints.NotNull;
import org.example.foodtruckback.common.enums.ReservationStatus;
import org.example.foodtruckback.entity.reservation.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation,Long> {
    List<Reservation> findByUserId(Long id);
    boolean existsByUser_IdAndSchedule_IdAndPickupTimeAndStatusIn(
            Long userId,
            Long ScheduleId,
            @NotNull(message = "픽업 예정 시간을 정해주세요.") LocalDateTime localDateTime,
            List<ReservationStatus> status
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
            "WHERE t.owner.id = :ownerId " +
            "ORDER BY r.createdAt DESC")
    List<Reservation> findForOwnerReservationList(@Param("ownerId") Long ownerId);

    @Query("SELECT DISTINCT r" +
            " FROM Reservation r" +
            " JOIN FETCH r.schedule s" +
            " JOIN FETCH s.truck t " +
            "JOIN FETCH s.location l " +
            "ORDER BY r.createdAt DESC")
    List<Reservation> findForAdminReservationList();
}