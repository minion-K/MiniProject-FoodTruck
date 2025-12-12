package org.example.foodtruckback.repository.schedule;

import org.example.foodtruckback.entity.truck.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface ScheduleRepository extends JpaRepository<Schedule,Long> {
    Collection<Schedule> findByTruckId(Long truckId);
}
