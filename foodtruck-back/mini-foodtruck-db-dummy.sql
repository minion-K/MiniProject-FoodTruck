USE `mini-foodtruck-db`;

SET FOREIGN_KEY_CHECKS = 0;

-- users 제외 전체 초기화
TRUNCATE TABLE order_items;
TRUNCATE TABLE reservation_items;
TRUNCATE TABLE payment_refunds;
TRUNCATE TABLE payments;
TRUNCATE TABLE orders;
TRUNCATE TABLE reservations;
TRUNCATE TABLE menu_items;
TRUNCATE TABLE truck_schedules;
TRUNCATE TABLE locations;
TRUNCATE TABLE trucks;
TRUNCATE TABLE refresh_tokens;
TRUNCATE TABLE user_roles;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------
-- 1. 유저 역할 세팅 (기존 users 활용)
-- -----------------------------
INSERT INTO user_roles (user_id, role_name)
SELECT id,
       CASE
           WHEN id = 1 THEN 'USER'
           WHEN id = 2 THEN 'OWNER'
           WHEN id = 3 THEN 'ADMIN'
           ELSE 'USER'
       END
FROM users
ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);

-- -----------------------------
-- 2. 트럭 생성 (owner = 2)
-- -----------------------------
INSERT INTO trucks (owner_id, name, cuisine, status)
VALUES
(2, '부산타코', 'MEXICAN', 'ACTIVE'),
(2, '서면버거', 'BURGER', 'ACTIVE'),
(2, '떡볶이킹', 'KOREAN', 'ACTIVE'),
(2, '스시트럭', 'JAPANESE', 'ACTIVE');

-- -----------------------------
-- 3. 위치 (삼어로 61 정확 좌표 기반)
-- -----------------------------
INSERT INTO locations (name, address, latitude, longitude) VALUES
('우방신세계타운 정문', '부산 금정구', 35.2028494, 129.1161518),
('아파트 후문 골목', '부산 금정구', 35.2025000, 129.1166000),
('삼어로 메인도로', '부산 금정구', 35.2032000, 129.1157000),
('주택가 상권 라인', '부산 금정구', 35.2023000, 129.1159000),
('근린공원 입구', '부산 금정구', 35.2030000, 129.1169000);

-- -----------------------------
-- 4. 스케줄 (4월 전체)
-- -----------------------------
INSERT INTO truck_schedules (truck_id, location_id, start_time, end_time, status, max_reservations)
SELECT
    t.id,
    (1 + FLOOR(RAND()*4)),
    DATE_ADD('2026-04-01 11:00:00', INTERVAL seq DAY),
    DATE_ADD('2026-04-01 20:00:00', INTERVAL seq DAY),
    CASE
        WHEN seq < 20 THEN 'CLOSED'
        WHEN seq < 26 THEN 'OPEN'
        ELSE 'PLANNED'
    END,
    100
FROM trucks t
JOIN (
    SELECT 0 seq UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
    UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14
    UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19
    UNION ALL SELECT 20 UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24
    UNION ALL SELECT 25 UNION ALL SELECT 26 UNION ALL SELECT 27
) d;

-- -----------------------------
-- 5. 메뉴
-- -----------------------------
INSERT INTO menu_items (truck_id, name, price)
SELECT t.id, CONCAT('메뉴', n), (3000 + FLOOR(RAND()*7000))
FROM trucks t
JOIN (
    SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
) nums;

-- -----------------------------
-- 6. 예약 (PENDING + CONFIRMED 섞기)
-- -----------------------------
INSERT INTO reservations (schedule_id, user_id, pickup_time, total_amount, status)
SELECT
    s.id,
    1,
    DATE_ADD(s.start_time, INTERVAL FLOOR(RAND()*8) HOUR),
    10000 + FLOOR(RAND()*20000),
    CASE
        WHEN RAND() < 0.6 THEN 'CONFIRMED'
        ELSE 'PENDING'
    END
FROM truck_schedules s
WHERE s.status IN ('CLOSED','OPEN');

-- -----------------------------
-- 7. 예약 아이템
-- -----------------------------
INSERT INTO reservation_items (reservation_id, menu_item_id, menu_name, price, qty)
SELECT
    r.id,
    m.id,
    m.name,
    m.price,
    1 + FLOOR(RAND()*3)
FROM reservations r
JOIN menu_items m ON m.truck_id = (
    SELECT truck_id FROM truck_schedules WHERE id = r.schedule_id
)
WHERE RAND() < 0.7;

-- -----------------------------
-- 8. 주문 (CONFIRMED 예약만)
-- -----------------------------
INSERT INTO orders (schedule_id, user_id, source, reservation_id, amount, status, paid_at)
SELECT
    r.schedule_id,
    r.user_id,
    'RESERVATION',
    r.id,
    r.total_amount,
    'PAID',
    r.pickup_time
FROM reservations r
WHERE r.status = 'CONFIRMED';

-- -----------------------------
-- 9. 현장 주문 (ONSITE)
-- -----------------------------
INSERT INTO orders (schedule_id, user_id, source, amount, status, paid_at)
SELECT
    s.id,
    NULL,
    'ONSITE',
    8000 + FLOOR(RAND()*15000),
    'PAID',
    DATE_ADD(s.start_time, INTERVAL FLOOR(RAND()*8) HOUR)
FROM truck_schedules s
WHERE RAND() < 0.5;

-- -----------------------------
-- 10. 주문 아이템
-- -----------------------------
INSERT INTO order_items (order_id, menu_item_id, menu_name, qty, unit_price)
SELECT
    o.id,
    m.id,
    m.name,
    1 + FLOOR(RAND()*3),
    m.price
FROM orders o
JOIN truck_schedules s ON o.schedule_id = s.id
JOIN menu_items m ON m.truck_id = s.truck_id
WHERE RAND() < 0.6;

-- -----------------------------
-- 11. 결제 (핵심: productCode 정책)
-- -----------------------------
INSERT INTO payments (user_id, payment_order_id, order_id, payment_key, amount, method, status, product_code, product_name, approved_at)
SELECT
    o.user_id,
    CONCAT('ORD-', o.id),
    o.id,
    UUID(),
    o.amount,
    'MOCK',
    'SUCCESS',
    CASE
        WHEN o.source = 'RESERVATION' THEN CONCAT('RES-', o.reservation_id)
        ELSE CONCAT('ORD-', o.id)
    END,
    '푸드트럭 주문',
    o.paid_at
FROM orders o;

-- -----------------------------
-- 12. 일부 환불 데이터
-- -----------------------------
INSERT INTO payment_refunds (payment_id, amount, reason, status, completed_at)
SELECT
    p.id,
    p.amount,
    '단순 변심',
    'COMPLETED',
    DATE_ADD(p.approved_at, INTERVAL 1 HOUR)
FROM payments p
WHERE RAND() < 0.1;
