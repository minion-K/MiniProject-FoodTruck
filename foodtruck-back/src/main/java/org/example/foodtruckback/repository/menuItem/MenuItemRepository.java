package org.example.foodtruckback.repository.menuItem;

import jakarta.validation.constraints.NotBlank;
import org.example.foodtruckback.entity.truck.MenuItem;
import org.example.foodtruckback.entity.truck.Truck;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Collection;

public interface MenuItemRepository extends JpaRepository<MenuItem,Long> {
    Collection<MenuItem> findByTruckId(Long truckId);

    Collection<MenuItem> findAllByTruck(Truck truck);

    boolean existsByTruckId(Long truckId);

    boolean existsByTruckAndName(Truck truck, @NotBlank(message = "음식명을 입력해주세요.") String name);
}
