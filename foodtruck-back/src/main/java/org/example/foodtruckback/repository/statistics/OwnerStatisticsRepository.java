package org.example.foodtruckback.repository.statistics;

import org.example.foodtruckback.dto.statistics.response.*;
import org.example.foodtruckback.entity.truck.Schedule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface OwnerStatisticsRepository extends JpaRepository<Schedule, Long> {

    @Query("""
        SELECT new org.example.foodtruckback.dto.statistics.response.DashboardResponseDto(
            COALESCE(SUM
                (p.amount - COALESCE((
                    SELECT SUM(pr.amount)
                    FROM PaymentRefund pr
                    WHERE pr.payment = p
                        AND pr.status = org.example.foodtruckback.common.enums.RefundStatus.COMPLETED
                    ), 0)
            ) ,0),
            (SELECT COUNT(o.id)
             FROM Order o
             WHERE o.status != org.example.foodtruckback.common.enums.OrderStatus.REFUNDED
                 AND o.schedule.truck.owner.id = :ownerId
                 AND (:truckId IS NULL OR o.schedule.truck.id = :truckId)
             ),
            (SELECT COUNT(r.id)
             FROM Reservation r
             WHERE r.status != org.example.foodtruckback.common.enums.ReservationStatus.CANCELED
                 AND r.schedule.truck.owner.id = :ownerId
                 AND (:truckId IS NULL OR r.schedule.truck.id = :truckId)
             )
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
    """)
    DashboardResponseDto getDashBoard(Long ownerId, Long truckId);

    @Query("""
        SELECT new org.example.foodtruckback.dto.statistics.response.WeeklySalesResponseDto(
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
            AND p.approvedAt >= :fromDate
            AND t.owner.id = :ownerId
            AND (:truckId IS NULL OR t.id = :truckId)
        GROUP BY FUNCTION('DATE', p.approvedAt)
        ORDER BY FUNCTION('DATE', p.approvedAt)
    """)
    List<WeeklySalesResponseDto> getWeeklySales(Long ownerId, LocalDateTime fromDate, Long truckId);

    @Query(value = """
        SELECT name, SUM(qty) AS totalQty
        FROM (
            SELECT oi.menu_name AS name, oi.qty AS qty
            FROM orders o
            JOIN order_items oi
                ON oi.order_id = o.id
            JOIN payments p
                ON p.product_code = CONCAT('ORD-', o.id)
                AND p.status = 'SUCCESS'
            LEFT JOIN (
                    SELECT payment_id, SUM(amount) AS refund_amount
                    FROM payment_refunds
                    WHERE status = 'COMPLETED'
                    GROUP BY payment_id
            ) pr
                ON pr.payment_id = p.id
            JOIN truck_schedules s
                ON o.schedule_id = s.id
            JOIN trucks t
                ON s.truck_id = t.id
            WHERE t.owner_id = :ownerId
                AND (:truckId IS NULL OR t.id = :truckId)
                AND (pr.refund_amount IS NULL OR pr.refund_amount < p.amount)

            UNION ALL

            SELECT ri.menu_name AS name, ri.qty AS qty
            FROM reservations r
            JOIN reservation_items ri
                ON ri.reservation_id = r.id
            JOIN payments p
                ON p.product_code = CONCAT('RES-', r.id)
                AND p.status = 'SUCCESS'
            LEFT JOIN (
                    SELECT payment_id, SUM(amount) AS refund_amount
                    FROM payment_refunds
                    WHERE status = 'COMPLETED'
                    GROUP BY payment_id
            ) pr
                ON pr.payment_id = p.id
            JOIN truck_schedules s
                ON r.schedule_id = s.id
            JOIN trucks t
                ON s.truck_id = t.id
            WHERE t.owner_id = :ownerId
                AND (:truckId IS NULL OR t.id = :truckId)
                AND (pr.refund_amount IS NULL OR pr.refund_amount < p.amount)
        ) tmp
        GROUP BY name
        ORDER BY SUM(qty) DESC
        LIMIT 5
    """, nativeQuery = true)
    List<Object[]> getTopMenus(Long ownerId, Long truckId);

    @Query(value = """
        SELECT new org.example.foodtruckback.dto.statistics.response.ScheduleSalesResponseDto(
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
        GROUP BY s.id, s.location.name, s.startTime
        ORDER BY s.startTime
    """,
    countQuery = """
        SELECT COUNT(s.id)
        FROM Schedule s
        LEFT JOIN Truck t
            ON t.id = s.truck.id
        WHERE t.owner.id = :ownerId
            AND (:truckId IS NULL OR t.id = :truckId)
    """)
    Page<ScheduleSalesResponseDto> getSchedules(Long ownerId, Long truckId, Pageable pageable);

    @Query("""
        SELECT new org.example.foodtruckback.dto.statistics.response.ScheduleDetailResponseDto(
            COUNT(DISTINCT o.id),
            COUNT(DISTINCT r.id),
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
        WHERE p.status = org.example.foodtruckback.common.enums.PaymentStatus.SUCCESS
            AND s.id = :scheduleId
    """)
    ScheduleDetailResponseDto getScheduleDetail(Long scheduleId);

    @Query("""
        SELECT new org.example.foodtruckback.dto.statistics.response.RefundResponseDto(
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
    """)
    RefundResponseDto getRefundCount(Long ownerId, Long truckId);


    @Query("""
        SELECT new org.example.foodtruckback.dto.statistics.response.OrderTypeResponseDto(
            CASE
                WHEN o.source = org.example.foodtruckback.common.enums.OrderSource.RESERVATION THEN 'RESERVATION'
                ELSE 'ONSITE'
            END,
            COUNT(o)
            )
        FROM Order o
        WHERE (:truckId IS NULL OR o.schedule.truck.id = :truckId)
            AND o.status != org.example.foodtruckback.common.enums.OrderStatus.CANCELED
        GROUP BY o.source
    """)
    List<OrderTypeResponseDto> getOrderTypeCounts(Long truckId);
}
