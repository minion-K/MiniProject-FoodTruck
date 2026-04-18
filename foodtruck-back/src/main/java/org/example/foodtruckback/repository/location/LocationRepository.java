package org.example.foodtruckback.repository.location;

import org.example.foodtruckback.entity.location.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    boolean existsByAddress(String address);
    @Query("""
        SELECT l
        FROM Location l
        WHERE (:keyword IS NULL OR l.name LIKE %:keyword% OR l.address LIKE %:keyword%)
    """)
    List<Location> findAll(String keyword);
}
