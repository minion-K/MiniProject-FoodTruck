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
    Page<Truck> findByOwnerIdOrderByIdDesc(Long id, Pageable pageable);

    @Query("""
        SELECT t
        FROM Truck t
        WHERE (:status IS NULL OR t.status = :status)
            AND (:keyword IS NULL OR t.name LIKE %:keyword% OR t.cuisine LIKE %:keyword%)
        ORDER BY t.createdAt DESC
    """)
    Page<Truck> findAllWithFilter(Pageable pageable, String keyword, TruckStatus status);

    @Query("""
        SELECT DISTINCT COUNT(t)
        FROM Truck t
        WHERE t.status IN ('ACTIVE', 'INACTIVE')
    """)
    long countTruckActive();

    @Query("""
        SELECT DISTINCT COUNT(t)
        FROM Truck t
        WHERE t.status = 'SUSPENDED'
    """)
    long countTruckSuspended();
}
