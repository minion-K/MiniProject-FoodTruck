package org.example.foodtruckback.repository.location;

import org.example.foodtruckback.entity.location.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    boolean existsByAddress(String address);
}
