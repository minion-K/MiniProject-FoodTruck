package org.example.foodtruckback.repository.statistics;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.example.foodtruckback.common.enums.OrderSource;
import org.example.foodtruckback.common.enums.PaymentStatus;
import org.example.foodtruckback.dto.statistics.response.admin.*;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public class AdminStatisticsRepositoryImpl implements AdminStatisticsRepository{
    @PersistenceContext
    private EntityManager em;

    @Override
    public DashboardResponseDto getAdminDashboard(String region, LocalDateTime fromDate, LocalDateTime toDate) {
        System.out.println("region = [" + region + "]");
        System.out.println("fromDate = [" + fromDate + "]");
        System.out.println("toDate = [" + toDate + "]");

        String sql= """
           SELECT 
               (
                   SELECT COALESCE(SUM(p.amount - COALESCE(
                       (SELECT SUM(pr.amount)
                        FROM payment_refunds pr
                        WHERE pr.payment_id = p.id
                            AND pr.status = 'COMPLETED'
                            AND pr.completed_at BETWEEN ?2 AND ?3
                       ), 0)
                   ), 0)
                   FROM payments p
                   LEFT JOIN orders o
                       ON p.order_id = o.id
                   LEFT JOIN reservations r
                       ON p.product_code = CONCAT('RES-', r.id)
                   LEFT JOIN truck_schedules s
                       ON s.id = COALESCE(o.schedule_id, r.schedule_id)
                   LEFT JOIN locations l
                       ON l.id = s.location_id
                   WHERE p.status = 'SUCCESS'
                       AND p.approved_at BETWEEN ?2 AND ?3
                       AND (
                           ?1 = 'ALL'
                           OR (l.name LIKE CONCAT('%', ?1, '%')
                               OR l.address LIKE CONCAT('%', ?1, '%'))
                       )
               ),
               
               (
                   SELECT COUNT(o.id)
                   FROM orders o
                   JOIN truck_schedules s
                       ON o.schedule_id = s.id
                   JOIN locations l
                       ON l.id = s.location_id
                   WHERE o.status != 'REFUNDED'
                       AND o.created_at BETWEEN ?2 AND ?3
                       AND (
                           ?1 = 'ALL'
                           OR (l.name LIKE CONCAT('%', ?1, '%')
                               OR l.address LIKE CONCAT('%', ?1, '%'))
                       )
               ),
               (
                   SELECT COUNT(r.id)
                   FROM reservations r
                   JOIN truck_schedules s
                       ON r.schedule_id = s.id
                   JOIN locations l 
                       ON l.id = s.location_id
                   WHERE r.status != 'CANCELED'
                       AND r.created_at BETWEEN ?2 AND ?3
                       AND (
                           ?1 = 'ALL'
                           OR (l.name LIKE CONCAT('%', ?1, '%')
                               OR l.address LIKE CONCAT('%', ?1, '%'))
                       )
               ),
               (
                   SELECT COUNT(pr.id)
                   FROM payment_refunds pr
                   JOIN payments p
                       ON pr.payment_id = p.id
                   LEFT JOIN orders o
                       ON p.order_id = o.id
                   LEFT JOIN reservations r
                       ON p.product_code = CONCAT('RES-', r.id)
                   LEFT JOIN truck_schedules s
                       ON s.id = COALESCE(o.schedule_id, r.schedule_id)
                   LEFT JOIN locations l
                       ON l.id = s.location_id
                   WHERE pr.status = 'COMPLETED'
                       AND pr.completed_at BETWEEN ?2 AND ?3
                       AND (
                           ?1 = 'ALL'
                           OR (l.name LIKE CONCAT('%', ?1, '%')
                              OR l.address LIKE CONCAT('%', ?1, '%'))
                       )
               ),

               (
                   SELECT COUNT(*)
                   FROM users
               ),

               (
                   SELECT COUNT(*)
                   FROM trucks
               ),

               (
                   SELECT 
                       CASE WHEN COUNT(r.id) = 0 THEN 0
                           ELSE ROUND(COUNT(o.id) * 100.0 / COUNT(r.id), 2)
                       END
                   FROM reservations r
                   LEFT JOIN orders o
                       ON o.reservation_id = r.id
                       AND o.created_at BETWEEN ?2 AND ?3
                   JOIN truck_schedules s
                       ON r.schedule_id = s.id
                   JOIN locations l ON l.id = s.location_id
                   WHERE r.created_at BETWEEN ?2 AND ?3
                       AND (
                           ?1 = 'ALL'
                           OR (l.name LIKE CONCAT('%', ?1, '%')
                               OR l.address LIKE CONCAT('%', ?1, '%'))
                       )
               )
           """;

        Query query = em.createNativeQuery(sql);
        System.out.println(sql);
        query.setParameter(1, region);
        query.setParameter(2, fromDate);
        query.setParameter(3, toDate);

        Object[] result = (Object[]) query.getSingleResult();

        return DashboardResponseDto.of(
                ((Number) result[0]).longValue(),
                ((Number) result[1]).longValue(),
                ((Number) result[2]).longValue(),
                ((Number) result[3]).longValue(),
                ((Number) result[4]).longValue(),
                ((Number) result[5]).longValue(),
                result[6] != null ? ((Number) result[6]).doubleValue() : 0.0
        );
    }

    @Override
    public List<GrowthTrendResponseDto> getGrowthTrend(String region, LocalDateTime fromDate, LocalDateTime toDate) {
        String sql = """
            SELECT
                DATE(p.approved_at) AS date,
                COALESCE(SUM(p.amount - 
                    COALESCE(pr_sum.refund_amount, 0)), 0) AS revenue,
                COUNT(DISTINCT o.id) AS orderCount,
                COUNT(DISTINCT COALESCE(o.user_id, r.user_id)) AS userCount,
                COUNT(DISTINCT s.truck_id) AS truckCount
            FROM payments p
            LEFT JOIN orders o
                ON p.order_id = o.id
            LEFT JOIN reservations r
                ON p.product_code = CONCAT('RES-', r.id)
            LEFT JOIN (
                SELECT payment_id, SUM(amount) AS refund_amount
                FROM payment_refunds
                WHERE status = 'COMPLETED'
                GROUP BY payment_id
            ) pr_sum
                ON pr_sum.payment_id = p.id
            LEFT JOIN truck_schedules s
                ON s.id = (COALESCE(o.schedule_id, r.schedule_id))
            LEFT JOIN trucks t
                ON t.id = s.truck_id
            LEFT JOIN locations l
                ON l.id = s.location_id
            WHERE p.status = 'SUCCESS'
                AND p.approved_at BETWEEN ?2 AND ?3
                AND (?1 = 'ALL' OR l.name LIKE CONCAT('%', ?1, '%')
                    OR l.address LIKE CONCAT('%', ?1, '%'))
            GROUP BY DATE(p.approved_at)
            ORDER BY date ASC
            """;
        Query query = em.createNativeQuery(sql);
        query.setParameter(1, region);
        query.setParameter(2, fromDate);
        query.setParameter(3, toDate);

        List<Object[]> results = query.getResultList();

        return results.stream()
                .map(result -> new GrowthTrendResponseDto(
                        result[0].toString(),
                        ((Number) result[1]).longValue(),
                        ((Number) result[2]).longValue(),
                        ((Number) result[3]).longValue(),
                        ((Number) result[4]).longValue()
                )).toList();
    }

    @Override
    public ConversionFunnelResponseDto getConversionFunnel(String region, LocalDateTime fromDate, LocalDateTime toDate) {
        String sql = """
            SELECT 
                COUNT(r.id) AS reservations,
                COUNT(DISTINCT CASE WHEN r.status = 'CONFIRMED' THEN r.id END) AS confirmReservations,
                COUNT(DISTINCT o.id) AS orders,
                COUNT(DISTINCT COALESCE(op.id, rp.id)) AS payments,
                
                ROUND(
                    COUNT(DISTINCT o.id) * 100.0
                        / NULLIF(COUNT(DISTINCT  r.id), 0), 2
                ) AS reservationToOrderRate,
                ROUND(
                    COUNT(DISTINCT COALESCE(op.id, rp.id)) * 100.0
                        / NULLIF(COUNT(DISTINCT  o.id), 0), 2
                ) AS orderToPaymentRate
            FROM reservations r
            LEFT JOIN orders o
                ON o.reservation_id = r.id
            LEFT JOIN payments op
                ON op.order_id = o.id
            LEFT JOIN payments rp
                ON rp.product_code = CONCAT('RES-', r.id)
            LEFT JOIN truck_schedules s
                ON s.id = r.schedule_id
            LEFT JOIN locations l
                ON l.id = s.location_id
            WHERE r.created_at BETWEEN ?2 AND ?3
                AND (?1 = 'ALL' OR l.name LIKE CONCAT('%', ?1, '%')
                    OR l.address LIKE CONCAT('%', ?1, '%'))
            """;

        Query query = em.createNativeQuery(sql);
        query.setParameter(1, region);
        query.setParameter(2, fromDate);
        query.setParameter(3, toDate);

        Object[] result = (Object[]) query.getSingleResult();

        return new ConversionFunnelResponseDto(
                ((Number) result[0]).longValue(),
                ((Number) result[1]).longValue(),
                ((Number) result[2]).longValue(),
                ((Number) result[3]).longValue(),
                result[4] != null ? ((Number) result[4]).doubleValue() : 0.0,
                result[5] != null ? ((Number) result[5]).doubleValue() : 0.0
        );
    }

    @Override
    public List<PaymentStatusResponseDto> getPaymentStatus(String region, LocalDateTime fromDate, LocalDateTime toDate) {
        String sql = """
            SELECT 
                p.status,
                COUNT(*) AS count,
                COALESCE(SUM(p.amount), 0) AS amount
            FROM payments p
            LEFT JOIN orders o
                ON p.order_id = o.id
            LEFT JOIN reservations r
                ON p.product_code = CONCAT('RES-', r.id)
            LEFT JOIN truck_schedules s
                ON s.id = COALESCE(o.schedule_id, r.schedule_id)
            LEFT JOIN locations l
                ON l.id = s.location_id
            WHERE p.approved_at BETWEEN ?2 AND ?3
                AND (?1 = 'ALL' OR l.name LIKE CONCAT('%', ?1, '%')
                    OR l.address LIKE CONCAT('%', ?1, '%'))
            GROUP BY p.status
            """;

        Query query = em.createNativeQuery(sql);
        query.setParameter(1, region);
        query.setParameter(2, fromDate);
        query.setParameter(3, toDate);

        List<Object[]> results = query.getResultList();

        return results.stream()
                .map(result -> new PaymentStatusResponseDto(
                        PaymentStatus.valueOf((String) result[0]),
                        ((Number) result[1]).longValue(),
                        ((Number) result[2]).longValue()
                )).toList();
    }

    @Override
    public List<OrderTypeResponseDto> getOrderType(String region, LocalDateTime fromDate, LocalDateTime toDate) {
        String sql = """
            SELECT CASE WHEN o.source = 'RESERVATION' THEN 'RESERVATION'
                        ELSE 'ONSITE'
                   END AS orderType,
                   COUNT(DISTINCT o.id) AS count
            FROM orders o
            JOIN truck_schedules s
                ON o.schedule_id = s.id
            JOIN locations l 
                ON l.id = s.location_id
            WHERE o.status NOT IN ('CANCEL', 'REFUNDED')
                AND o.created_at BETWEEN ?2 AND ?3
                AND (?1 = 'ALL' OR l.name LIKE CONCAT('%', ?1, '%')
                    OR l.address LIKE CONCAT('%', ?1, '%'))
            GROUP BY 
                CASE WHEN o.source = 'RESERVATION' THEN 'RESERVATION'
                     ELSE 'ONSITE'
                END
            """;

        Query query = em.createNativeQuery(sql);
        query.setParameter(1, region);
        query.setParameter(2, fromDate);
        query.setParameter(3, toDate);

        List<Object[]> results = query.getResultList();

        return results.stream()
                .map(result -> new OrderTypeResponseDto(
                        OrderSource.valueOf((String) result[0]),
                        ((Number) result[1]).longValue()
                )).toList();
    }

    @Override
    public List<TopTrucksResponseDto> getTopTrucks(String region, LocalDateTime fromDate, LocalDateTime toDate) {
        String sql = """
            SELECT
                t.id AS truckId,
                t.name AS truckName,
                COALESCE(SUM(DISTINCT (
                    COALESCE(p_order.amount, 0) + COALESCE(p_res.amount, 0) 
                    - COALESCE(pr_order.refund_amount, 0) - COALESCE(pr_res.refund_amount, 0)
                )), 0) AS revenue,
                COUNT(DISTINCT o.id) AS orderCount,
                ROUND(SUM(DISTINCT (
                    COALESCE(p_order.amount, 0) + COALESCE(p_res.amount, 0) 
                    - COALESCE(pr_order.refund_amount, 0) - COALESCE(pr_res.refund_amount, 0)
                )) / NULLIF(COUNT(DISTINCT COALESCE(o.id, r.id)), 0), 2
                ) AS avgSalesPerOrder
            FROM trucks t 
            JOIN truck_schedules s
                ON s.truck_id = t.id
            LEFT JOIN orders o 
                ON o.schedule_id = s.id
            LEFT JOIN reservations r
                ON r.schedule_id = s.id
            LEFT JOIN payments p_order
                ON p_order.order_id = o.id
                AND p_order.status = 'SUCCESS'
            LEFT JOIN payments p_res
                ON p_res.product_code = CONCAT('RES-', r.id)
                AND p_res.status = 'SUCCESS'
            LEFT JOIN(
                SELECT payment_id, SUM(amount) AS refund_amount
                FROM payment_refunds
                WHERE status = 'COMPLETED'
                GROUP BY payment_id
            ) pr_order
                ON pr_order.payment_id = p_order.id
            LEFT JOIN(
                SELECT payment_id, SUM(amount) AS refund_amount
                FROM payment_refunds
                WHERE status = 'COMPLETED'
                GROUP BY payment_id
            ) pr_res
                ON pr_res.payment_id = p_res.id
            LEFT JOIN locations l
                ON l.id = s.location_id
            WHERE (
                (p_order.approved_at BETWEEN ?2 AND ?3)
                    OR (p_res.approved_at BETWEEN ?2 AND ?3)    
                )
                AND (?1 = 'ALL' OR l.name LIKE CONCAT('%', ?1, '%')
                    OR l.address LIKE CONCAT('%', ?1, '%'))
            GROUP BY t.id, t.name
            ORDER BY revenue DESC
            LIMIT 5
            """;

        Query query = em.createNativeQuery(sql);
        query.setParameter(1, region);
        query.setParameter(2, fromDate);
        query.setParameter(3, toDate);

        List<Object[]> results = query.getResultList();

        return results.stream()
                .map(result -> new TopTrucksResponseDto(
                        ((Number) result[0]).longValue(),
                        (String) result[1],
                        ((Number) result[2]).longValue(),
                        ((Number) result[3]).longValue(),
                        result[4] != null ? ((Number) result[4]).doubleValue() : 0.0
                )).toList();
    }

    @Override
    public List<TopMenusResponseDto> getTopMenus(String region, LocalDateTime fromDate, LocalDateTime toDate) {
        String sql = """
           SELECT 
               menu_name AS menuName,
               SUM(qty) AS quantity,
               SUM(revenue) AS revenue
           FROM (
               SELECT 
                   oi.menu_name, 
                   oi.qty, 
                   (oi.qty * oi.unit_price) 
                       - COALESCE(pr_sum.refund_amount, 0) AS revenue
               FROM order_items oi
               JOIN orders o
                   ON oi.order_id = o.id
               JOIN payments p
                   ON p.order_id = o.id
               LEFT JOIN (
                   SELECT payment_id, SUM(amount) AS refund_amount
                   FROM payment_refunds
                   WHERE status = 'COMPLETED'
                   GROUP BY payment_id
               ) pr_sum
                   ON pr_sum.payment_id = p.id
               JOIN truck_schedules s
                   ON s.id = o.schedule_id
               JOIN locations l ON l.id = s.location_id
               WHERE p.status = 'SUCCESS'
                   AND p.approved_at BETWEEN ?2 AND ?3
                   AND (?1 = 'ALL' OR l.name LIKE CONCAT('%', ?1, '%')
                       OR l.address LIKE CONCAT('%', ?1, '%'))
               
               UNION ALL
               
               SELECT ri.menu_name, 
                      ri.qty, 
                      (ri.qty * ri.price)
                           - COALESCE(pr_sum2.refund_amount, 0) AS revenue
               FROM reservation_items ri
               JOIN reservations r
                   ON ri.reservation_id = r.id 
               JOIN payments p
                   ON p.product_code = CONCAT('RES-', r.id)
               LEFT JOIN (
                   SELECT payment_id, SUM(amount) AS refund_amount
                   FROM payment_refunds
                   WHERE status = 'COMPLETED'
                   GROUP BY payment_id
               ) pr_sum2
                   ON pr_sum2.payment_id = p.id
               JOIN truck_schedules s
                   ON s.id = r.schedule_id
               JOIN locations l ON l.id = s.location_id
               WHERE p.status = 'SUCCESS'
                   AND p.approved_at BETWEEN ?2 AND ?3
                   AND r.status != 'CANCELED'
                   AND (?1 = 'ALL' OR l.name LIKE CONCAT('%', ?1, '%')
                       OR l.address LIKE CONCAT('%', ?1, '%'))
           ) AS menu_stat
           GROUP BY menu_name
           ORDER BY revenue DESC
           LIMIT 5
            """;

        Query query = em.createNativeQuery(sql);
        query.setParameter(1, region);
        query.setParameter(2, fromDate);
        query.setParameter(3, toDate);

        List<Object[]> results = query.getResultList();

        return results.stream()
                .map(result -> new TopMenusResponseDto(
                        (String) result[0],
                        ((Number) result[1]).longValue(),
                        ((Number) result[2]).longValue()
                )).toList();
    }

    @Override
    public List<InsightResponseDto> getInsights(String region, LocalDateTime fromDate, LocalDateTime toDate) {
        String sql = """
            WITH item_union AS (
                SELECT 
                    oi.menu_name,
                    oi.qty,
                    o.id AS order_key,
                    o.amount AS total_amount,
                    l.name AS location_name,
                    p.approved_at
                FROM order_items oi
                JOIN orders o
                    ON oi.order_id = o.id
                JOIN payments p
                    ON p.order_id = o.id
                JOIN truck_schedules s
                    ON s.id = o.schedule_id
                JOIN locations l
                    ON l.id = s.location_id
                WHERE p.status = 'SUCCESS'
                    AND p.approved_at BETWEEN ?2 AND ?3
                    AND (?1 = 'ALL' OR l.name LIKE CONCAT('%', ?1, '%')
                        OR l.address LIKE CONCAT('%', ?1, '%'))
                
                UNION ALL
                
                SELECT
                    ri.menu_name,
                    ri.qty,
                    r.id AS order_key,
                    r.total_amount AS total_amount,
                    l.name AS location_name,
                    p.approved_at
                FROM reservation_items ri
                JOIN reservations r
                    ON ri.reservation_id = r.id
                JOIN payments p
                    ON p.product_code = CONCAT('RES-', r.id)
                JOIN truck_schedules s
                    ON s.id = r.schedule_id
                JOIN locations l
                    ON l.id = s.location_id
                WHERE p.status = 'SUCCESS'
                    AND p.approved_at BETWEEN ?2 AND ?3
                    AND (?1 = 'ALL' OR l.name LIKE CONCAT('%', ?1, '%')
                           OR l.address LIKE CONCAT('%', ?1, '%'))
            ),
            order_union AS (
                SELECT DISTINCT
                    order_key,
                    total_amount,
                    location_name,
                    DATE(approved_at) AS order_date
                FROM item_union
            ),
            total_summary AS (
                SELECT
                    COUNT(DISTINCT order_date) AS operating_days,
                    COALESCE(SUM(total_amount), 0) AS total_sales,
                    COUNT(*) AS total_orders,
                    ROUND(COALESCE(SUM(total_amount), 0) / NULLIF(COUNT(DISTINCT order_date), 0), 0) AS avg_daily_sales
                FROM order_union
            ),
            total_qty_summary AS (
                SELECT COALESCE(SUM(qty), 0) AS total_qty
                FROM item_union
            )
                
            (SELECT 'BEST_MENU' AS category,
                   '⭐ 가장 많이 팔린 메뉴' AS title,
                   CONCAT(best_menu.menu_name, '이(가) 총 ', best_menu.total_qty, '개 판매되어 전체 판매량의 ',
                   ROUND(100.0 * best_menu.total_qty / NULLIF((SELECT total_qty FROM total_qty_summary), 0), 1),
                   '%를 차지했습니다.') AS description,
                best_menu.total_qty AS value,
                '개' AS unit
            FROM (
                SELECT menu_name, SUM(qty) AS total_qty
                FROM item_union
                GROUP BY menu_name
                ORDER BY total_qty DESC, menu_name ASC
            ) AS best_menu
            LIMIT 1)
            
            UNION ALL
            
            SELECT 'TOTAL_SALES' AS category,
                   '💰 이번 기간 총 매출' AS title,
                   CONCAT('총 ', total_sales, '원 | 평균 하루 ', avg_daily_sales, '원') AS description,
                    total_sales AS value,
                    '원' AS unit
            FROM total_summary
            
            UNION ALL
            
            (SELECT 'BEST_LOCATION' AS category,
                   '📢 가장 매출이 높은 지역' AS title,
                    CONCAT(best_location.location_name, '에서 총 ', best_location.total_amount, '원 판매되었습니다.') AS description,
                   best_location.total_amount AS value,
                   '원' AS unit
            FROM (
                SELECT location_name, SUM(total_amount) AS total_amount
                FROM order_union
                GROUP BY location_name
                ORDER BY SUM(total_amount) DESC, location_name ASC
                LIMIT 1
                ) AS best_location
            )
            
            UNION ALL
            
            SELECT 'AVG_ORDER' AS category,
                   '🛒 평균 객단가' AS title,
                   '한 번 방문당 고객이 평균적으로 지불한 금액입니다.' AS description,
                   ROUND(AVG(total_amount), 0) AS value,
                   '원' AS unit
            FROM order_union
            
            UNION ALL
            
            SELECT 'OPERATION' AS category,
                   '📅 운영 성과' AS title,
                   CONCAT('총 ', operating_days, '일 운영하며 ', total_orders, '건의 주문을 받았습니다. ',
                   '하루 평균 ', ROUND(total_orders / NULLIF(operating_days, 0), 1), '건') AS description,
                   operating_days AS value,
                   '일' AS unit
            FROM total_summary
            """;

        Query query = em.createNativeQuery(sql);
        query.setParameter(1, region);
        query.setParameter(2, fromDate);
        query.setParameter(3, toDate);

        List<Object[]> results = query.getResultList();

        return results.stream()
                .map(result -> new InsightResponseDto(
                        result[0] != null ? String.valueOf(result[0]) : null,
                        result[1] != null ? String.valueOf(result[1]) : null,
                        result[2] != null ? String.valueOf(result[2]) : null,
                        result[3],
                        result[4] != null ? String.valueOf(result[4]) : null
                ))
                .toList();
    }
}
