package org.example.foodtruckback.repository.truck;

import org.example.foodtruckback.entity.truck.Truck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TruckRepository extends JpaRepository<Truck,Long> {
}
