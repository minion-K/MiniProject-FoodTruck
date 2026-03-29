USE `mini-foodtruck-db`;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE payment_refunds;
TRUNCATE TABLE payments;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE reservation_items;
TRUNCATE TABLE reservations;
TRUNCATE TABLE menu_items;
TRUNCATE TABLE truck_schedules;
TRUNCATE TABLE locations;
TRUNCATE TABLE trucks;

SET FOREIGN_KEY_CHECKS = 1;

-- 날짜 기준
SET @today = CURDATE();
SET @week_start = DATE_SUB(@today, INTERVAL WEEKDAY(@today) DAY); -- 이번주 월요일
SET @month_start = DATE_SUB(@today, INTERVAL DAY(@today)-1 DAY); -- 이번달 1일
SET @last_month_start = DATE_SUB(@month_start, INTERVAL 1 MONTH);

-- -------------------------------
-- 1. 트럭
INSERT INTO trucks (id, owner_id, name, cuisine, status) VALUES
(1,2,'스테이크트럭','WESTERN','ACTIVE'),
(2,2,'치킨트럭','KOREAN','ACTIVE'),
(3,2,'버거트럭','AMERICAN','ACTIVE'),
(4,2,'피자트럭','ITALIAN','ACTIVE');

-- -------------------------------
-- 2. 위치
INSERT INTO locations (id, name, address, latitude, longitude) VALUES
(1,'서면1','부산 서면',35.157,129.059),
(2,'서면2','부산 서면',35.158,129.060),
(3,'전포1','부산 서면',35.159,129.061),
(4,'전포2','부산 서면',35.160,129.062);

-- -------------------------------
-- 3. 메뉴
INSERT INTO menu_items (truck_id, name, price) VALUES
(1,'등심스테이크',25000),(1,'안심스테이크',28000),(1,'치킨스테이크',20000),(1,'함박스테이크',18000),(1,'바베큐',23000),(1,'립스테이크',27000),
(2,'후라이드',18000),(2,'양념치킨',20000),(2,'간장치킨',19000),(2,'닭강정',17000),
(3,'버거',14000),(3,'치즈버거',16000),(3,'더블버거',18000),
(4,'마르게리타',15000),(4,'페퍼로니',17000),(4,'치즈피자',16000);

-- -------------------------------
-- 4. 스케줄 (이번주, 이번달 일부)
INSERT INTO truck_schedules (id, truck_id, location_id, start_time, end_time, status) VALUES
-- 이번주
(1,1,1,@week_start + INTERVAL 10 HOUR,@week_start + INTERVAL 18 HOUR,'OPEN'),
(2,2,2,@week_start + INTERVAL 11 HOUR,@week_start + INTERVAL 19 HOUR,'OPEN'),
(3,3,3,@week_start + INTERVAL 12 HOUR,@week_start + INTERVAL 20 HOUR,'OPEN'),
(4,4,4,@week_start + INTERVAL 13 HOUR,@week_start + INTERVAL 21 HOUR,'OPEN'),
-- 이번달 임의 날짜
(5,1,1,@month_start + INTERVAL 3 DAY + INTERVAL 10 HOUR,@month_start + INTERVAL 3 DAY + INTERVAL 18 HOUR,'OPEN'),
(6,2,2,@month_start + INTERVAL 5 DAY + INTERVAL 11 HOUR,@month_start + INTERVAL 5 DAY + INTERVAL 19 HOUR,'OPEN'),
(7,3,3,@month_start + INTERVAL 10 DAY + INTERVAL 12 HOUR,@month_start + INTERVAL 10 DAY + INTERVAL 20 HOUR,'OPEN');

-- -------------------------------
-- 5. 예약 (기간 확장, user_id 4~10)
INSERT INTO reservations (id, schedule_id, user_id, pickup_time, total_amount, status, created_at) VALUES
-- 이번주 예약
(1,1,4,@week_start + INTERVAL 12 HOUR,0,'CONFIRMED',@week_start + INTERVAL 10 MINUTE),
(2,1,5,@week_start + INTERVAL 13 HOUR,0,'CONFIRMED',@week_start + INTERVAL 20 MINUTE),
(3,2,6,@week_start + INTERVAL 12 HOUR,0,'CONFIRMED',@week_start + INTERVAL 10 MINUTE),
(4,3,7,@week_start + INTERVAL 13 HOUR,0,'CONFIRMED',@week_start + INTERVAL 15 MINUTE),
-- 이번달 예약
(5,5,8,@month_start + INTERVAL 3 DAY + INTERVAL 12 HOUR,0,'CONFIRMED',@month_start + INTERVAL 3 DAY + INTERVAL 10 MINUTE),
(6,6,9,@month_start + INTERVAL 5 DAY + INTERVAL 13 HOUR,0,'CONFIRMED',@month_start + INTERVAL 5 DAY + INTERVAL 11 MINUTE),
(7,7,10,@month_start + INTERVAL 10 DAY + INTERVAL 14 HOUR,0,'CONFIRMED',@month_start + INTERVAL 10 DAY + INTERVAL 12 MINUTE);

-- -------------------------------
-- 6. reservation_items
INSERT INTO reservation_items (reservation_id, menu_item_id, menu_name, price, qty) VALUES
(1,1,'등심스테이크',25000,2),
(1,2,'안심스테이크',28000,1),
(2,3,'치킨스테이크',20000,1),
(3,7,'후라이드',18000,2),
(3,8,'양념치킨',20000,1),
(4,11,'버거',14000,1),
(4,12,'치즈버거',16000,2),
(5,1,'등심스테이크',25000,1),
(5,2,'안심스테이크',28000,2),
(6,7,'후라이드',18000,1),
(6,8,'양념치킨',20000,2),
(7,11,'버거',14000,2),
(7,12,'치즈버거',16000,1);

-- -------------------------------
-- 6-1. 예약 총액 계산
UPDATE reservations r
JOIN (
  SELECT reservation_id, SUM(price*qty) AS total
  FROM reservation_items
  GROUP BY reservation_id
) t ON r.id = t.reservation_id
SET r.total_amount = t.total;

-- -------------------------------
-- 7. 예약 결제
INSERT INTO payments (user_id, payment_key, payment_order_id, amount, method, status, product_code, product_name, approved_at)
SELECT r.user_id,
       CONCAT('pk_res_', r.id),
       CONCAT('RES_', r.id),
       r.total_amount,
       'TOSS_PAY',
       'SUCCESS',
       CONCAT('RES-', r.id),
       '예약',
       r.created_at + INTERVAL 10 MINUTE
FROM reservations r;

-- -------------------------------
-- 8. 예약 기반 주문
INSERT INTO orders (id, schedule_id, user_id, source, reservation_id, amount, status, paid_at, created_at)
SELECT r.id, r.schedule_id, r.user_id, 'RESERVATION', r.id, r.total_amount, 'PAID', p.approved_at, r.created_at
FROM reservations r
JOIN payments p ON p.product_code = CONCAT('RES-', r.id);

-- -------------------------------
-- 9. 예약 기반 order_items
INSERT INTO order_items (order_id, menu_item_id, menu_name, unit_price, qty)
SELECT o.id, ri.menu_item_id, ri.menu_name, ri.price, ri.qty
FROM orders o
JOIN reservation_items ri ON ri.reservation_id = o.reservation_id;

-- -------------------------------
-- 10. 현장 주문
INSERT INTO orders (id, schedule_id, user_id, source, amount, status, paid_at, created_at)
VALUES
(100,1,8,'ONSITE',43000,'PAID',@week_start + INTERVAL 15 HOUR,@week_start + INTERVAL 11 HOUR),
(101,2,9,'ONSITE',38000,'PAID',@week_start + INTERVAL 16 HOUR,@week_start + INTERVAL 12 HOUR),
(102,5,10,'ONSITE',40000,'PAID',@month_start + INTERVAL 3 DAY + INTERVAL 15 HOUR,@month_start + INTERVAL 3 DAY + INTERVAL 12 HOUR);

-- -------------------------------
-- 10-1. 현장 주문 order_items
INSERT INTO order_items (order_id, menu_item_id, menu_name, unit_price, qty)
VALUES
(100,1,'등심스테이크',25000,1),
(100,2,'안심스테이크',18000,1),
(101,7,'후라이드',18000,1),
(101,8,'양념치킨',20000,1),
(102,1,'등심스테이크',25000,1),
(102,2,'안심스테이크',28000,1);

-- -------------------------------
-- 11. 현장 주문 결제
INSERT INTO payments (user_id, payment_key, payment_order_id, order_id, amount, method, status, product_code, product_name, approved_at)
SELECT o.user_id, CONCAT('pk_ord_', o.id), CONCAT('ORD_', o.id), o.id, o.amount, 'MOCK','SUCCESS', CONCAT('ORD-',o.id),'주문', o.paid_at
FROM orders o
WHERE o.source='ONSITE';

-- -------------------------------
-- 12. 환불 예시 (예약1만)
INSERT INTO payment_refunds (payment_id, amount, reason, status, completed_at)
SELECT p.id, p.amount, '전체환불', 'COMPLETED', p.approved_at + INTERVAL 30 MINUTE
FROM payments p
WHERE p.product_code='RES-1';

-- -------------------------------
-- 12-1. 환불 상태 반영
UPDATE reservations r SET r.status='CANCELED' WHERE r.id=1;
UPDATE orders o SET o.status='REFUNDED' WHERE o.reservation_id=1;