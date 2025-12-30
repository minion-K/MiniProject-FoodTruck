package org.example.foodtruckback.repository.reservation;

import org.example.foodtruckback.common.enums.ReservationStatus;
import org.example.foodtruckback.entity.reservation.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation,Long> {
    List<Reservation> findByUserId(Long id);

    boolean existsByUser_IdAndSchedule_IdAndStatusIn(Long userId, Long scheduleId, List<ReservationStatus> statues);
}