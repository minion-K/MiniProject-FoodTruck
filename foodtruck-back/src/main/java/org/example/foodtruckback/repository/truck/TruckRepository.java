package org.example.foodtruckback.repository.truck;

import org.example.foodtruckback.common.enums.TruckStatus;
import org.example.foodtruckback.entity.truck.Truck;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TruckRepository extends JpaRepository<Truck,Long> {
    List<Truck> findByOwnerIdOrderByIdDesc(Long id);

    @Query("""
        SELECT t
        FROM Truck t
        WHERE (:status IS NULL OR t.status = :status)
            AND (:keyword IS NULL OR t.name LIKE %:keyword% OR t.cuisine LIKE %:keyword%)
    """)
    Page<Truck> findAllWithFilter(Pageable pageable, String keyword, TruckStatus status);
}
