package org.example.foodtruckback.repository.order;

import org.example.foodtruckback.common.enums.OrderSource;
import org.example.foodtruckback.common.enums.OrderStatus;
import org.example.foodtruckback.entity.order.Order;
import org.example.foodtruckback.entity.reservation.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @NonNull
    Optional<Order> findById(@NonNull Long orderId);

    boolean existsByReservation(Reservation reservation);

    Optional<Order> findByReservation(Reservation reservation);

    @Query(value = """
        SELECT DISTINCT o
        FROM Order o
        LEFT JOIN o.orderItems oi
        LEFT JOIN o.user u
        JOIN o.schedule s
        WHERE s.id = :scheduleId
        ORDER BY o.createdAt DESC
    """,
    countQuery = """
        SELECT COUNT(DISTINCT  o.id)
        FROM Order o
        LEFT JOIN o.schedule s
        WHERE s.id = :scheduleId
    """)
    Page<Order> findOwnerOrders(@Param("scheduleId") Long scheduleId, Pageable pageable);

    @Query("""
        SELECT DISTINCT o
        FROM Order o
        LEFT JOIN FETCH o.orderItems
        LEFT JOIN FETCH o.user
        LEFT JOIN FETCH o.schedule s
        WHERE o.user.id = :userId
        ORDER BY o.createdAt DESC
    """)
    List<Order> findByUserIdFetch(@Param("userId") Long userId);


//    TODO: orderItems N + 1 최적화 필요(IN 쿼리)
    @Query(value = """
        SELECT DISTINCT o
        FROM Order o
        LEFT JOIN FETCH o.user u
        JOIN o.schedule s
        JOIN s.truck t
        WHERE (:status IS NULL OR o.status = :status)
            AND (:keyword IS NULL OR u.name LIKE %:keyword% OR t.name LIKE %:keyword%)
            AND (:source IS NULL OR o.source = :source)
            AND (:startDate IS NULL OR o.createdAt >= :startDate)
            AND (:endDate IS NULL OR o.createdAt <= :endDate)
        ORDER BY o.createdAt DESC 
    """,
    countQuery = """
        SELECT COUNT(DISTINCT o)
        FROM Order o
        LEFT JOIN o.user u
        JOIN o.schedule s
        JOIN s.truck t
        WHERE (:status IS NULL OR o.status = :status)
            AND (:keyword IS NULL OR u.name LIKE %:keyword% OR t.name LIKE %:keyword%)
            AND (:source IS NULL OR o.source = :source)
            AND (:startDate IS NULL OR o.createdAt >= :startDate)
            AND (:endDate IS NULL OR o.createdAt <= :endDate)
    """)
    Page<Order> findAdminOrders(Pageable pageable, LocalDateTime startDate, LocalDateTime endDate, OrderStatus status, String keyword, OrderSource source);
}