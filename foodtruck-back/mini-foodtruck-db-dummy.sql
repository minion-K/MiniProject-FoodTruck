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
SET SQL_SAFE_UPDATES = 0;
-- -------------------------------
-- 날짜 기준
-- -------------------------------
SET @today = CURDATE();
SET @week_start = DATE_SUB(@today, INTERVAL WEEKDAY(@today) DAY);
SET @last_week_start = DATE_SUB(@week_start, INTERVAL 7 DAY);

-- -------------------------------
-- 1. 트럭 (확장)
-- -------------------------------
INSERT INTO trucks (id, owner_id, name, cuisine, status) VALUES
(1,2,'타코트럭','MEXICAN','ACTIVE'),
(2,2,'치킨트럭','KOREAN','ACTIVE'),
(3,2,'버거트럭','AMERICAN','ACTIVE'),
(4,2,'피자트럭','ITALIAN','ACTIVE'),
(5,2,'분식트럭','KOREAN','ACTIVE'),
(6,2,'스테이크트럭','WESTERN','ACTIVE'),
(7,2,'카레트럭','INDIAN','ACTIVE'),
(8,2,'샌드위치트럭','FASTFOOD','ACTIVE');

-- -------------------------------
-- 2. 위치
-- -------------------------------
INSERT INTO locations (id, name, address, latitude, longitude) VALUES
(1,'서면1','부산 서면',35.157,129.059),
(2,'서면2','부산 서면',35.158,129.060),
(3,'전포1','부산 서면',35.159,129.061),
(4,'전포2','부산 서면',35.160,129.062),
(5,'부전','부산 서면',35.161,129.063),
(6,'범천','부산 서면',35.162,129.064),
(7,'문현','부산 서면',35.163,129.065),
(8,'가야','부산 서면',35.164,129.066);

-- -------------------------------
-- 3. 메뉴 (확장)
-- -------------------------------
INSERT INTO menu_items (truck_id, name, price) VALUES
(1,'타코',12000),(1,'퀘사디아',15000),(1,'부리또',13000),(1,'나초',9000),(1,'살사타코',14000),(1,'치킨타코',13500),
(2,'후라이드',18000),(2,'양념치킨',20000),(2,'간장치킨',19000),(2,'닭강정',17000),(2,'마늘치킨',21000),(2,'순살치킨',18000),
(3,'버거',14000),(3,'치즈버거',16000),(3,'더블버거',18000),(3,'베이컨버거',17000),(3,'새우버거',15000),(3,'불고기버거',15500),
(4,'마르게리타',15000),(4,'페퍼로니',17000),(4,'치즈피자',16000),(4,'불고기피자',18000),(4,'하와이안',17500),(4,'고르곤졸라',16500),
(5,'떡볶이',7000),(5,'순대',8000),(5,'튀김',6000),(5,'김밥',5000),(5,'라볶이',9000),(5,'오뎅',4000),
(6,'등심스테이크',25000),(6,'안심스테이크',28000),(6,'치킨스테이크',20000),(6,'함박스테이크',18000),(6,'바베큐',23000),(6,'립스테이크',27000),
(7,'치킨카레',12000),(7,'비프카레',14000),(7,'새우카레',13000),(7,'매운카레',13500),(7,'버터카레',15000),(7,'야채카레',11000),
(8,'햄샌드위치',8000),(8,'치킨샌드위치',9000),(8,'에그샌드위치',7500),(8,'BLT',9500),(8,'클럽샌드위치',10000),(8,'불고기샌드위치',10500);

-- -------------------------------
-- 4. 스케줄 (미래 없음)
-- -------------------------------
INSERT INTO truck_schedules (truck_id, location_id, start_time, end_time, status)
SELECT 
  t.id,
  t.id,
  d.day + INTERVAL 10 HOUR,
  d.day + INTERVAL 18 HOUR,
  'OPEN'
FROM trucks t
JOIN (
  SELECT DATE_ADD(@last_week_start, INTERVAL 2 DAY) day UNION
  SELECT DATE_ADD(@last_week_start, INTERVAL 4 DAY) UNION
  SELECT DATE_ADD(@week_start, INTERVAL 0 DAY) UNION
  SELECT DATE_ADD(@week_start, INTERVAL 1 DAY) UNION
  SELECT DATE_ADD(@week_start, INTERVAL 2 DAY)
) d
WHERE d.day <= @today;

-- -------------------------------
-- 5. 예약 (스케줄 내 생성)
-- -------------------------------
INSERT INTO reservations (schedule_id, user_id, pickup_time, total_amount, status, created_at)
SELECT 
  s.id,
  4 + FLOOR(RAND()*5),
  s.start_time + INTERVAL (60 + FLOOR(RAND()*240)) MINUTE,
  0,
  'CONFIRMED',
  s.start_time + INTERVAL FLOOR(RAND()*60) MINUTE
FROM truck_schedules s;

-- -------------------------------
-- 6. reservation_items
-- -------------------------------
INSERT INTO reservation_items (reservation_id, menu_item_id, menu_name, price, qty)
SELECT
  r.id,
  m.id,
  m.name,
  m.price,
  1 + FLOOR(RAND()*2)
FROM reservations r
JOIN truck_schedules s ON r.schedule_id = s.id
JOIN menu_items m ON m.truck_id = s.truck_id;

UPDATE reservations r
JOIN (
  SELECT reservation_id, SUM(price * qty) total
  FROM reservation_items
  GROUP BY reservation_id
) t ON r.id = t.reservation_id
SET r.total_amount = t.total;

-- -------------------------------
-- 7. 예약 결제 (시간 정합성 보장)
-- -------------------------------
INSERT INTO payments (user_id, payment_key, payment_order_id, amount, method, status, product_code, product_name, approved_at)
SELECT
  r.user_id,
  CONCAT('pk_res_', r.id),
  CONCAT('RES_', r.id),
  r.total_amount,
  'TOSS_PAY',
  'SUCCESS',
  CONCAT('RES-', r.id),
  '예약',
  r.created_at + INTERVAL FLOOR(RAND()*120) MINUTE
FROM reservations r;

-- -------------------------------
-- 8. 주문 생성 (예약 기반)
-- -------------------------------
INSERT INTO orders (schedule_id, user_id, source, reservation_id, amount, status, paid_at, created_at)
SELECT 
  r.schedule_id,
  r.user_id,
  'RESERVATION',
  r.id,
  r.total_amount,
  'PAID',
  p.approved_at,
  r.created_at
FROM reservations r
JOIN payments p ON p.product_code = CONCAT('RES-', r.id);

-- -------------------------------
-- 9. 현장 주문
-- -------------------------------
INSERT INTO orders (schedule_id, user_id, source, amount, status, paid_at, created_at)
SELECT 
  s.id,
  4 + FLOOR(RAND()*5),
  'ONSITE',
  0,
  'PAID',
  s.start_time + INTERVAL (30 + FLOOR(RAND()*300)) MINUTE,
  s.start_time + INTERVAL FLOOR(RAND()*200) MINUTE
FROM truck_schedules s
WHERE RAND() < 0.6;

-- -------------------------------
-- 10. order_items (인기 메뉴 bias 포함)
-- -------------------------------
INSERT INTO order_items (order_id, menu_item_id, menu_name, unit_price, qty)
SELECT
  o.id,
  m.id,
  m.name,
  m.price,
  1 + FLOOR(RAND()*2)
FROM orders o
JOIN truck_schedules s ON o.schedule_id = s.id
JOIN menu_items m ON m.truck_id = s.truck_id
ORDER BY RAND() * (CASE 
    WHEN m.name LIKE '%치킨%' THEN 0.5
    WHEN m.name LIKE '%버거%' THEN 0.7
    WHEN m.name LIKE '%떡볶이%' THEN 0.6
    ELSE 1
END);

UPDATE orders o
JOIN (
  SELECT order_id, SUM(unit_price*qty) total
  FROM order_items
  GROUP BY order_id
) t ON o.id = t.order_id
SET o.amount = t.total;

-- -------------------------------
-- 11. 주문 결제 (현장 주문만)
-- -------------------------------
INSERT INTO payments (user_id, payment_key, payment_order_id, order_id, amount, method, status, product_code, product_name, approved_at)
SELECT
  o.user_id,
  CONCAT('pk_ord_', o.id),
  CONCAT('ORD_', o.id),
  o.id,
  o.amount,
  'MOCK',
  'SUCCESS',
  CONCAT('ORD-', o.id),
  '주문',
  o.paid_at
FROM orders o
WHERE o.source = 'ONSITE';

-- -------------------------------
-- 12. 환불 (전체 환불 + 모든 도메인 반영)
-- -------------------------------

-- 1. 환불 생성 (전체 금액)
INSERT INTO payment_refunds (payment_id, amount, reason, status, completed_at)
SELECT
  p.id,
  p.amount,
  '전체환불',
  'COMPLETED',
  p.approved_at + INTERVAL 30 MINUTE
FROM payments p
WHERE p.id % 4 = 0;

-- 2. 주문 결제 환불 → 주문 상태 변경
UPDATE orders
SET status = 'REFUNDED'
WHERE id IN (
    SELECT id FROM (
        SELECT o.id
        FROM orders o
        JOIN payments p ON p.order_id = o.id
        JOIN payment_refunds pr ON pr.payment_id = p.id
        WHERE pr.status = 'COMPLETED'
    ) t
);
-- 3. 예약 결제 환불 → 예약 상태 변경
UPDATE reservations
SET status = 'CANCELED'
WHERE id IN (
    SELECT id FROM (
        SELECT r.id
        FROM reservations r
        JOIN payments p ON p.product_code = CONCAT('RES-', r.id)
        JOIN payment_refunds pr ON pr.payment_id = p.id
        WHERE pr.status = 'COMPLETED'
    ) t
);
-- 4. 예약 기반 주문도 같이 환불 처리
UPDATE orders
SET status = 'REFUNDED'
WHERE reservation_id IN (
    SELECT id FROM (
        SELECT r.id
        FROM reservations r
        WHERE r.status = 'CANCELED'
    ) t
);