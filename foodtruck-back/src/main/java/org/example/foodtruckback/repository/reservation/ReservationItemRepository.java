package org.example.foodtruckback.repository.reservation;

import org.example.foodtruckback.entity.reservation.ReservationItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationItemRepository extends JpaRepository<ReservationItem, Long> {

}
