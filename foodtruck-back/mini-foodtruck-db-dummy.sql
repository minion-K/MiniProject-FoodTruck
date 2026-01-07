USE `mini-foodtruck-db`;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE reservation_items;
TRUNCATE TABLE reservations;
TRUNCATE TABLE menu_items;
TRUNCATE TABLE truck_schedules;
TRUNCATE TABLE locations;
TRUNCATE TABLE trucks;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- 1. TRUCKS
-- =====================================================
INSERT INTO trucks (id, owner_id, name, cuisine, status) VALUES
(1, 2, '서면 불닭트럭', 'KOREAN', 'ACTIVE'),
(2, 2, '서면 타코트럭', 'MEXICAN', 'ACTIVE');

-- =====================================================
-- 2. LOCATIONS
-- =====================================================
INSERT INTO locations (id, name, address, latitude, longitude) VALUES
(1, '서면역 2번출구', '부산 부산진구', 35.1577, 129.0596),
(2, '서면 롯데백화점', '부산 부산진구', 35.1569, 129.0565),
(3, '서면 젊음의거리', '부산 부산진구', 35.1583, 129.0608),
(4, '부산시민공원 입구', '부산 부산진구', 35.1681, 129.0574);

-- =====================================================
-- 3. SCHEDULES
-- =====================================================
INSERT INTO truck_schedules
(id, truck_id, location_id, start_time, end_time, status, max_reservations)
VALUES
(1, 1, 1, '2026-01-06 11:00:00', '2026-01-06 15:00:00', 'OPEN', 50),
(2, 1, 2, '2026-01-06 17:00:00', '2026-01-06 21:00:00', 'OPEN', 40),
(3, 1, 3, '2026-01-05 11:00:00', '2026-01-05 15:00:00', 'CLOSED', 50),
(4, 1, 1, '2026-01-08 11:00:00', '2026-01-08 15:00:00', 'PLANNED', 30),
(5, 2, 4, '2026-01-06 12:00:00', '2026-01-06 18:00:00', 'OPEN', 60),
(6, 2, 2, '2026-01-07 18:00:00', '2026-01-07 22:00:00', 'CANCELED', 40);

-- =====================================================
-- 4. MENU ITEMS
-- =====================================================
INSERT INTO menu_items (id, truck_id, name, price, is_sold_out) VALUES
(1, 1, '불닭컵밥', 8000, false),
(2, 1, '치즈불닭', 9000, false),
(3, 1, '불닭볶음면', 7000, true),
(4, 1, '불닭만두', 6000, false),
(5, 2, '비프 타코', 8500, false),
(6, 2, '치킨 타코', 7500, false),
(7, 2, '나초 세트', 6500, false);

-- =====================================================
-- 5. RESERVATIONS (user_id = 1 고정)
-- =====================================================
INSERT INTO reservations
(id, schedule_id, user_id, pickup_time, total_amount, status, note)
VALUES
(1, 1, 1, '2026-01-06 11:00:00', 17000, 'PENDING', '덜 맵게'),
(2, 1, 1, '2026-01-06 12:00:00', 8000, 'CONFIRMED', NULL),
(3, 1, 1, '2026-01-06 13:00:00', 9000, 'NO_SHOW', NULL),
(4, 1, 1, '2026-01-06 14:00:00', 15000, 'REFUNDED', '환불'),
(5, 2, 1, '2026-01-06 17:00:00', 7000, 'PENDING', NULL),
(6, 2, 1, '2026-01-06 18:00:00', 13000, 'CONFIRMED', NULL),
(7, 2, 1, '2026-01-06 19:00:00', 9000, 'CANCELED', '시간 변경'),
(8, 5, 1, '2026-01-06 13:00:00', 15000, 'CONFIRMED', NULL),
(9, 5, 1, '2026-01-06 15:00:00', 7500, 'PENDING', NULL),
(10,5, 1, '2026-01-06 17:00:00', 16000, 'CONFIRMED', NULL);

-- =====================================================
-- 6. RESERVATION ITEMS
-- =====================================================
INSERT INTO reservation_items
(reservation_id, menu_item_id, menu_name, price, qty)
VALUES
(1,1,'불닭컵밥',8000,1),
(1,2,'치즈불닭',9000,1),
(2,1,'불닭컵밥',8000,1),
(3,2,'치즈불닭',9000,1),
(4,1,'불닭컵밥',8000,1),
(4,4,'불닭만두',6000,1),
(5,3,'불닭볶음면',7000,1),
(6,1,'불닭컵밥',8000,1),
(6,4,'불닭만두',6000,1),
(7,2,'치즈불닭',9000,1),
(8,5,'비프 타코',8500,1),
(8,7,'나초 세트',6500,1),
(9,6,'치킨 타코',7500,1),
(10,5,'비프 타코',8500,1),
(10,6,'치킨 타코',7500,1);

-- =====================================================
-- 7. ORDERS
-- =====================================================
INSERT INTO orders
(id, schedule_id, user_id, source, reservation_id, amount, currency, status, paid_at)
VALUES
(1, 1, 1, 'RESERVATION', 2, 8000, 'KRW', 'PAID', '2026-01-06 12:30:00'),
(2, 2, 1, 'RESERVATION', 6, 13000, 'KRW', 'PAID', '2026-01-06 18:30:00'),
(3, 5, 1, 'RESERVATION', 8, 15000, 'KRW', 'PENDING', NULL),
(4, 5, 1, 'RESERVATION', 10,16000, 'KRW', 'FAILED', NULL);


INSERT INTO order_items
(order_id, menu_item_id, qty, unit_price)
VALUES
(1,1,1,8000),
(2,1,1,8000),
(2,4,1,6000),
(3,5,1,8500),
(3,7,1,6500),
(4,5,1,8500),
(4,6,1,7500);