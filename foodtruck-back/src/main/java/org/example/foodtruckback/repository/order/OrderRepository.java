package org.example.foodtruckback.repository.order;

import org.example.foodtruckback.dto.order.response.OwnerOrderListResponseDto;
import org.example.foodtruckback.dto.order.response.UserOrderListResponseDto;
import org.example.foodtruckback.entity.order.Order;
import org.example.foodtruckback.entity.reservation.Reservation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @NonNull
    @EntityGraph(attributePaths = {"orderItems", "orderItems.menuItem", "user", "reservation"})
    Optional<Order> findById(@NonNull Long orderId);

    boolean existsByReservation(Reservation reservation);

    Optional<Order> findByReservation(Reservation reservation);

    @Query("""
        SELECT distinct o
        FROM Order o
        LEFT JOIN FETCH o.orderItems
        LEFT JOIN FETCH o.user
        LEFT JOIN FETCH o.schedule s
        WHERE s.truck.id = :truckId
        ORDER BY o.createdAt DESC
    """)
    List<Order> findByTruckIdFetch(@Param("truckId") Long truckId);

    @Query("""
        SELECT DISTINCT o
        FROM Order o
        LEFT JOIN FETCH o.orderItems
        LEFT JOIN FETCH o.user
        LEFT JOIN FETCH o.schedule s
        WHERE o.user.loginId = :loginId
        ORDER BY o.createdAt DESC
    """)
    List<Order> findByUserLoginIdFetch(@Param("loginId") String loginId);

    @Query("""
        SELECT DISTINCT o
        FROM Order o
        LEFT JOIN FETCH o.orderItems
        LEFT JOIN FETCH o.user
        LEFT JOIN FETCH o.schedule
        LEFT JOIN FETCH o.reservation
        ORDER BY o.createdAt DESC
    """)
    List<Order> findAllFetch();
}