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

-- -------------------------------
-- 1. 트럭
-- -------------------------------
INSERT INTO trucks (id, owner_id, name, cuisine, status) VALUES
(1,2,'타코트럭','MEXICAN','ACTIVE'),
(2,2,'치킨트럭','KOREAN','ACTIVE'),
(3,2,'버거트럭','AMERICAN','ACTIVE'),
(4,2,'카페트럭','CAFE','ACTIVE'),
(5,2,'디저트트럭','DESSERT','ACTIVE');

-- -------------------------------
-- 2. 위치
-- -------------------------------
INSERT INTO locations (id, name, address, latitude, longitude) VALUES
(1,'서면1','부산 서면',35.157,129.059),
(2,'서면2','부산 서면',35.158,129.060),
(3,'전포','부산 서면',35.159,129.061),
(4,'부전','부산 서면',35.160,129.062),
(5,'카페거리','부산 서면',35.161,129.063);

-- -------------------------------
-- 3. 메뉴 (가격 상승)
-- -------------------------------
INSERT INTO menu_items (truck_id, name, price) VALUES
(1,'타코A',12000),(1,'타코B',14000),(1,'타코C',16000),
(2,'치킨A',18000),(2,'치킨B',20000),(2,'닭강정',22000),
(3,'버거A',15000),(3,'버거B',17000),(3,'치즈버거',19000),
(4,'아메리카노',5000),(4,'라떼',6500),(4,'바닐라라떼',7000),
(5,'와플',9000),(5,'크레페',11000),(5,'케이크',13000);

-- -------------------------------
-- 4. 스케줄 (트럭별 7일)
-- -------------------------------
INSERT INTO truck_schedules (id, truck_id, location_id, start_time, end_time, status)
SELECT 
  (t.id-1)*7 + d.day + 1,
  t.id,
  t.id,
  DATE_SUB(NOW(), INTERVAL (6-d.day) DAY),
  DATE_SUB(NOW(), INTERVAL (6-d.day) DAY) + INTERVAL 8 HOUR,
  'OPEN'
FROM trucks t
CROSS JOIN (
  SELECT 0 as day UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6
) d;

-- -------------------------------
-- 5. 예약 (트럭별 7일)
-- -------------------------------
INSERT INTO reservations (id, schedule_id, user_id, pickup_time, total_amount, status)
SELECT 
  s.id,
  s.id,
  4 + FLOOR(RAND()*6),
  s.start_time + INTERVAL 2 HOUR,
  50000 + FLOOR(RAND()*150000),
  'CONFIRMED'
FROM truck_schedules s
WHERE s.truck_id <=5;

-- -------------------------------
-- 6. reservation_items
-- -------------------------------
INSERT INTO reservation_items (reservation_id, menu_item_id, menu_name, price, qty)
SELECT
  r.id,
  m.id,
  m.name,
  m.price,
  1 + FLOOR(RAND()*3)
FROM reservations r
JOIN truck_schedules s ON r.schedule_id = s.id
JOIN menu_items m ON m.truck_id = s.truck_id
WHERE RAND() < 0.6;

-- -------------------------------
-- 7. 주문 (예약 기반 + 현장 주문 섞기)
-- -------------------------------
INSERT INTO orders (id, schedule_id, user_id, source, amount, status, paid_at)
SELECT 
  s.id,
  s.id,
  4 + FLOOR(RAND()*6),
  IF(RAND() > 0.5, 'ONSITE', 'RESERVATION'),
  50000 + FLOOR(RAND()*200000),
  'PAID',
  s.start_time + INTERVAL FLOOR(RAND()*6) HOUR
FROM truck_schedules s;

-- -------------------------------
-- 8. order_items
-- -------------------------------
INSERT INTO order_items (order_id, menu_item_id, menu_name, unit_price, qty)
SELECT
  o.id,
  m.id,
  m.name,
  m.price,
  1 + FLOOR(RAND()*3)
FROM orders o
JOIN truck_schedules s ON o.schedule_id = s.id
JOIN menu_items m ON m.truck_id = s.truck_id
WHERE RAND() < 0.6;

-- -------------------------------
-- 9. 결제
-- -------------------------------
INSERT INTO payments (user_id, payment_key, payment_order_id, order_id, amount, method, status, product_code, product_name, approved_at)
SELECT
  o.user_id,
  CONCAT('pk_', o.id),
  CONCAT('O', o.id),
  o.id,
  o.amount,
  'MOCK',
  'SUCCESS',
  CONCAT('ORD-', o.id),
  '주문',
  o.paid_at
FROM orders o;

-- -------------------------------
-- 10. 환불 일부
-- -------------------------------
INSERT INTO payment_refunds (payment_id, amount, reason, status, completed_at)
SELECT
  p.id,
  p.amount,
  '테스트 환불',
  'COMPLETED',
  NOW()
FROM payments p
WHERE p.id % 10 = 0;