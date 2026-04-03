package org.example.foodtruckback.repository.statistics;

import org.example.foodtruckback.dto.statistics.response.owner.*;
import org.example.foodtruckback.entity.truck.Schedule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface OwnerStatisticsRepository extends JpaRepository<Schedule, Long> {

    @Query("""
        SELECT new org.example.foodtruckback.dto.statistics.response.owner.DashboardResponseDto(
            (SELECT COALESCE(SUM(p.amount - COALESCE(
                (SELECT SUM(pr.amount)
                FROM PaymentRefund pr
                WHERE pr.payment = p
                    AND pr.status = org.example.foodtruckback.common.enums.RefundStatus.COMPLETED
                    AND pr.completedAt BETWEEN :fromDate AND :toDate
                ), 0)
            ) ,0)
            FROM Payment p
            LEFT JOIN Order o
                ON p.orderId = o.id
            LEFT JOIN Schedule os
                ON o.schedule.id = os.id
            LEFT JOIN Truck ot
                ON os.truck.id = ot.id
            LEFT JOIN Reservation r
                ON p.productCode = CONCAT('RES-', r.id)
            LEFT JOIN Schedule rs
                ON r.schedule.id = rs.id
            LEFT JOIN Truck rt
                ON rs.truck.id = rt.id
            WHERE p.status = org.example.foodtruckback.common.enums.PaymentStatus.SUCCESS
                AND (ot.owner.id = :ownerId OR rt.owner.id = :ownerId)
                AND (:truckId IS NULL OR ot.id = :truckId OR rt.id = :truckId)
                AND p.approvedAt BETWEEN :fromDate AND :toDate
            ),
            (SELECT COUNT(o.id)
             FROM Order o
             JOIN o.schedule s
             JOIN s.truck t
             WHERE o.status != org.example.foodtruckback.common.enums.OrderStatus.REFUNDED
                 AND t.owner.id = :ownerId
                 AND (:truckId IS NULL OR t.id= :truckId)
                 AND o.createdAt BETWEEN :fromDate AND :toDate
             ),
            (SELECT COUNT(r.id)
             FROM Reservation r
             JOIN r.schedule s
             JOIN s.truck t
             WHERE r.status != org.example.foodtruckback.common.enums.ReservationStatus.CANCELED
                 AND t.owner.id = :ownerId
                 AND (:truckId IS NULL OR t.id= :truckId)
                 AND r.createdAt BETWEEN :fromDate AND :toDate
             )
        )
    """)
    DashboardResponseDto getDashBoard(Long ownerId, Long truckId, LocalDateTime fromDate, LocalDateTime toDate);

    @Query("""
        SELECT new org.example.foodtruckback.dto.statistics.response.owner.WeeklySalesResponseDto(
            FUNCTION('DATE', p.approvedAt),
            COALESCE(SUM
                (p.amount - COALESCE((
                    SELECT SUM(pr.amount)
                    FROM PaymentRefund pr
                    WHERE pr.payment = p
                        AND pr.status = org.example.foodtruckback.common.enums.RefundStatus.COMPLETED
                    ), 0)
            ) ,0)
        )
        FROM Payment p
        LEFT JOIN Order o
            ON p.orderId = o.id
        LEFT JOIN Reservation r
            ON p.productCode = CONCAT('RES-', r.id)
        LEFT JOIN Schedule s
            ON s.id = COALESCE(o.schedule.id, r.schedule.id)
        LEFT JOIN Truck t
            ON t.id = s.truck.id
        WHERE p.status = org.example.foodtruckback.common.enums.PaymentStatus.SUCCESS
            AND p.approvedAt BETWEEN :fromDate AND :toDate
            AND t.owner.id = :ownerId
            AND (:truckId IS NULL OR t.id = :truckId)
        GROUP BY FUNCTION('DATE', p.approvedAt)
        ORDER BY FUNCTION('DATE', p.approvedAt)
    """)
    List<WeeklySalesResponseDto> getWeeklySales(Long ownerId, Long truckId, LocalDateTime fromDate, LocalDateTime toDate);

    @Query(value = """
        SELECT name, SUM(qty) AS totalQty
        FROM (
            SELECT oi.menu_name AS name, oi.qty AS qty
            FROM orders o
            JOIN order_items oi
                ON oi.order_id = o.id
            JOIN payments p
                ON p.order_id = o.id
                AND p.status = 'SUCCESS'
                AND p.approved_at BETWEEN :fromDate AND :toDate
            LEFT JOIN payment_refunds pr
                ON pr.payment_id = p.id
                AND pr.status = 'COMPLETED'
            JOIN truck_schedules s
                ON o.schedule_id = s.id
            JOIN trucks t
                ON s.truck_id = t.id
            WHERE t.owner_id = :ownerId
                AND (:truckId IS NULL OR t.id = :truckId)
                AND pr.id IS NULL

            UNION ALL

            SELECT ri.menu_name AS name, ri.qty AS qty
            FROM reservations r
            JOIN reservation_items ri
                ON ri.reservation_id = r.id
            JOIN payments p
                ON p.product_code = CONCAT('RES-', r.id)
                AND p.status = 'SUCCESS'
                AND p.approved_at BETWEEN :fromDate AND :toDate
            LEFT JOIN payment_refunds pr
                ON pr.payment_id = p.id
                AND pr.status = 'COMPLETED'
            JOIN truck_schedules s
                ON r.schedule_id = s.id
            JOIN trucks t
                ON s.truck_id = t.id
            WHERE t.owner_id = :ownerId
                AND (:truckId IS NULL OR t.id = :truckId)
                AND pr.id IS NULL
        ) tmp
        GROUP BY name
        ORDER BY totalQty DESC
        LIMIT 5
    """, nativeQuery = true)
    List<Object[]> getTopMenus(Long ownerId, Long truckId, LocalDateTime fromDate, LocalDateTime toDate);

    @Query(value = """
        SELECT new org.example.foodtruckback.dto.statistics.response.owner.ScheduleSalesResponseDto(
            s.id, s.location.name, s.startTime,
            COALESCE(SUM
                (p.amount - COALESCE((
                    SELECT SUM(pr.amount)
                    FROM PaymentRefund pr
                    WHERE pr.payment = p
                        AND pr.status = org.example.foodtruckback.common.enums.RefundStatus.COMPLETED
                ), 0)
            ) ,0)
        )
        FROM Payment p
        LEFT JOIN Order o
            ON p.orderId = o.id
        LEFT JOIN Reservation r
            ON p.productCode = CONCAT('RES-', r.id)
        LEFT JOIN Schedule s
            ON s.id = COALESCE(o.schedule.id, r.schedule.id)
        LEFT JOIN Truck t
            ON t.id = s.truck.id
        WHERE p.status = org.example.foodtruckback.common.enums.PaymentStatus.SUCCESS
            AND t.owner.id = :ownerId
            AND (:truckId IS NULL OR t.id = :truckId)
            AND p.approvedAt BETWEEN :fromDate AND :toDate
        GROUP BY s.id, s.location.name, s.startTime
        ORDER BY s.startTime
    """,
    countQuery = """
        SELECT COUNT(s.id)
        FROM Schedule s
        JOIN Truck t
            ON t.id = s.truck.id
        WHERE t.owner.id = :ownerId
            AND (:truckId IS NULL OR t.id = :truckId)
            AND s.startTime BETWEEN :fromDate AND :toDate
    """)
    Page<ScheduleSalesResponseDto> getSchedules(Long ownerId, Long truckId, LocalDateTime fromDate, LocalDateTime toDate, Pageable pageable);

    @Query("""
        SELECT new org.example.foodtruckback.dto.statistics.response.owner.RefundResponseDto(
            Count(pr.id)
            )
        FROM PaymentRefund pr
        JOIN pr.payment p
        LEFT JOIN Order o
            ON p.orderId = o.id
        LEFT JOIN Reservation r
            ON p.productCode = CONCAT('RES-', r.id)
        LEFT JOIN Schedule s
            ON s.id = COALESCE(o.schedule.id, r.schedule.id)
        LEFT JOIN Truck t
            ON t.id = s.truck.id
        WHERE pr.status = org.example.foodtruckback.common.enums.RefundStatus.COMPLETED
            AND t.owner.id = :ownerId
            AND (:truckId IS NULL OR t.id = :truckId)
            AND pr.completedAt BETWEEN :fromDate AND :toDate
    """)
    RefundResponseDto getRefundCount(Long ownerId, Long truckId, LocalDateTime fromDate, LocalDateTime toDate);


    @Query("""
        SELECT new org.example.foodtruckback.dto.statistics.response.owner.OrderTypeResponseDto(
            CASE
                WHEN o.source = org.example.foodtruckback.common.enums.OrderSource.RESERVATION THEN 'RESERVATION'
                ELSE 'ONSITE'
            END,
            COUNT(o)
        )
        FROM Order o
        WHERE o.schedule.truck.owner.id = :ownerId
            AND (:truckId IS NULL OR o.schedule.truck.id = :truckId)
            AND o.status NOT IN(
                    org.example.foodtruckback.common.enums.OrderStatus.CANCELED,
                    org.example.foodtruckback.common.enums.OrderStatus.REFUNDED
                ) 
            AND o.createdAt BETWEEN :fromDate AND :toDate
        GROUP BY o.source
    """)
    List<OrderTypeResponseDto> getOrderTypeCounts(Long ownerId, Long truckId, LocalDateTime fromDate, LocalDateTime toDate);

    @Query("""
        SELECT new org.example.foodtruckback.dto.statistics.response.owner.OrderTypeResponseDto(
            CASE 
                WHEN o.source = org.example.foodtruckback.common.enums.OrderSource.RESERVATION THEN 'RESERVATION'
                ELSE 'ONSITE'
            END,
            COUNT(o)
            )
        FROM Order o
        WHERE o.schedule.id = :scheduleId
            AND o.status NOT IN (
                    org.example.foodtruckback.common.enums.OrderStatus.CANCELED,
                    org.example.foodtruckback.common.enums.OrderStatus.REFUNDED
                )
        GROUP BY o.source        
    """)
    List<OrderTypeResponseDto> getOrderTypeBySchedule(Long scheduleId);

    @Query(value = """
        SELECT menu_name AS menuName, SUM(qty) AS totalQty
        FROM (
             SELECT oi.menu_name, oi.qty
             FROM orders o
             JOIN order_items oi
                 ON oi.order_id = o.id
             JOIN payments p
                 ON p.order_id = o.id
                 AND p.status = 'SUCCESS'
             LEFT JOIN payment_refunds pr
                 ON pr.payment_id = p.id
                 AND pr.status = 'COMPLETED'
             WHERE o.schedule_id = :scheduleId
                 AND o.status NOT IN ('CANCELED', 'REFUNDED')
                 AND pr.id IS NULL
        
             UNION ALL
        
             SELECT ri.menu_name, ri.qty
             FROM reservations r
             JOIN reservation_items ri
                 ON ri.reservation_id = r.id
             JOIN payments p 
                 ON p.product_code = CONCAT('RES-', r.id)
                 AND p.status = 'SUCCESS'
             LEFT JOIN payment_refunds pr
                 ON pr.payment_id = p.id
                 AND pr.status = 'COMPLETED'
             WHERE r.schedule_id = :scheduleId
                 AND r.status != 'CANCELED'
                 AND pr.id IS NULL
        ) tmp
        GROUP BY menuName
        ORDER BY SUM(qty) DESC
        LIMIT 5
    """, nativeQuery = true)
    List<Object[]> getTopMenusBySchedule(Long scheduleId);

    @Query(value = """
        SELECT CONCAT(hour_val, '~', hour_val + 1) AS timeSlot,
               COUNT(*) AS count
        FROM (
            SELECT HOUR(o.paid_at) AS hour_val
            FROM orders o
            JOIN truck_schedules s
                ON o.schedule_id = s.id
            WHERE o.schedule_id = :scheduleId
                AND o.status NOT IN ('CANCELED', 'REFUNDED')
                AND o.paid_at BETWEEN s.start_time AND s.end_time
            UNION ALL
            SELECT HOUR(r.pickup_time) AS hour_val
            FROM reservations r
            JOIN truck_schedules s
                ON r.schedule_id = s.id
            WHERE r.schedule_id = :scheduleId
                AND r.status != 'CANCELED'
                AND r.pickup_time BETWEEN s.start_time AND s.end_time
        ) tmp
        GROUP BY hour_val
        ORDER BY hour_val
    """, nativeQuery = true)
    List<Object[]> getTimeSlotBySchedule(Long scheduleId);
}
