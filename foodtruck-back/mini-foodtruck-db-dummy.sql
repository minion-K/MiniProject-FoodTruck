USE `mini-foodtruck-db`;

SET FOREIGN_KEY_CHECKS = 0;

-- 기존 데이터 삭제 (users 제외)
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
-- 1) Locations
-- -------------------------------
INSERT INTO locations (id, name, address, latitude, longitude)
VALUES
(1, '서면 지하상가 입구', '부산 부산진구 서면', 35.15523, 129.05954),
(2, '서면 롯데백화점 앞', '부산 부산진구 부전동', 35.15648, 129.06072);

-- -------------------------------
-- 2) Trucks
-- -------------------------------
INSERT INTO trucks (id, owner_id, name, cuisine, status)
VALUES
(1, 2, '타코천국', '멕시코음식', 'ACTIVE'),
(2, 2, '치킨킹', '치킨', 'ACTIVE'),
(3, 2, '핫도그마스터', '간식', 'ACTIVE');

-- -------------------------------
-- 3) Truck Schedules
-- -------------------------------
INSERT INTO truck_schedules (id, truck_id, location_id, start_time, end_time, status)
VALUES
(1, 1, 1, '2026-03-20 11:00:00', '2026-03-20 14:00:00', 'OPEN'),
(2, 1, 2, '2026-03-21 11:00:00', '2026-03-21 14:00:00', 'OPEN'),
(3, 2, 1, '2026-03-20 12:00:00', '2026-03-20 15:00:00', 'OPEN'),
(4, 2, 2, '2026-03-21 12:00:00', '2026-03-21 15:00:00', 'OPEN'),
(5, 3, 1, '2026-03-20 10:00:00', '2026-03-20 13:00:00', 'OPEN');

-- -------------------------------
-- 4) Menu Items
-- -------------------------------
INSERT INTO menu_items (id, truck_id, name, price, is_sold_out)
VALUES
(1, 1, '타코천국 메뉴 1', 7000, FALSE),
(2, 1, '타코천국 메뉴 2', 8000, FALSE),
(3, 2, '치킨킹 메뉴 1', 9000, FALSE),
(4, 2, '치킨킹 메뉴 2', 8500, FALSE),
(5, 2, '치킨킹 메뉴 3', 9500, FALSE),
(6, 3, '핫도그마스터 메뉴 1', 5000, FALSE);

-- -------------------------------
-- 5) Reservations
-- -------------------------------
-- CONFIRMED 예약 → 주문 생성 시킬 것
INSERT INTO reservations (id, schedule_id, user_id, pickup_time, total_amount, status)
VALUES
(1, 1, 1, '2026-03-20 11:30:00', 15000, 'CONFIRMED'),
(2, 1, 4, '2026-03-20 11:40:00', 16000, 'CONFIRMED'),
(3, 3, 5, '2026-03-20 12:15:00', 9500, 'CONFIRMED'),
(4, 5, 6, '2026-03-20 10:30:00', 5000, 'CONFIRMED'),
(5, 2, 7, '2026-03-21 11:30:00', 8000, 'CANCELED'); -- 취소 예약 포함

-- -------------------------------
-- 6) Reservation Items
-- -------------------------------
INSERT INTO reservation_items (id, reservation_id, menu_item_id, menu_name, price, qty)
VALUES
(1, 1, 1, '타코천국 메뉴 1', 7000, 1),
(2, 1, 2, '타코천국 메뉴 2', 8000, 1),
(3, 2, 2, '타코천국 메뉴 2', 8000, 2),
(4, 2, 1, '타코천국 메뉴 1', 7000, 1),
(5, 3, 5, '치킨킹 메뉴 3', 9500, 1),
(6, 4, 6, '핫도그마스터 메뉴 1', 5000, 1),
(7, 5, 2, '타코천국 메뉴 2', 8000, 1);

-- -------------------------------
-- 7) Orders (예약 → 주문 생성)
-- -------------------------------
INSERT INTO orders (id, schedule_id, user_id, source, reservation_id, amount, status, paid_at)
VALUES
(1, 1, 1, 'RESERVATION', 1, 15000, 'PAID', '2026-03-19 20:00:00'),
(2, 1, 4, 'RESERVATION', 2, 16000, 'PAID', '2026-03-19 20:05:00'),
(3, 3, 5, 'RESERVATION', 3, 9500, 'PAID', '2026-03-19 20:10:00'),
(4, 5, 6, 'RESERVATION', 4, 5000, 'PAID', '2026-03-19 20:15:00'),
(5, 2, 7, 'RESERVATION', 5, 8000, 'REFUNDED', '2026-03-19 20:20:00'); -- 취소/환불된 주문

-- -------------------------------
-- 8) Order Items
-- -------------------------------
INSERT INTO order_items (id, order_id, menu_item_id, menu_name, qty, unit_price)
VALUES
(1, 1, 1, '타코천국 메뉴 1', 1, 7000),
(2, 1, 2, '타코천국 메뉴 2', 1, 8000),
(3, 2, 2, '타코천국 메뉴 2', 2, 8000),
(4, 2, 1, '타코천국 메뉴 1', 1, 7000),
(5, 3, 5, '치킨킹 메뉴 3', 1, 9500),
(6, 4, 6, '핫도그마스터 메뉴 1', 1, 5000),
(7, 5, 2, '타코천국 메뉴 2', 1, 8000);

-- -------------------------------
-- 9) Payments
-- -------------------------------
INSERT INTO payments (id, user_id, payment_order_id, order_id, payment_key, amount, method, status, product_code, product_name, approved_at)
VALUES
(1, 1, 'PAY-1', 1, 'KEY-1', 15000, 'MOCK', 'SUCCESS', 'RES-1', '타코천국 예약 1', '2026-03-19 20:01:00'),
(2, 4, 'PAY-2', 2, 'KEY-2', 16000, 'MOCK', 'SUCCESS', 'RES-2', '타코천국 예약 2', '2026-03-19 20:06:00'),
(3, 5, 'PAY-3', 3, 'KEY-3', 9500, 'MOCK', 'SUCCESS', 'RES-3', '치킨킹 예약 3', '2026-03-19 20:11:00'),
(4, 6, 'PAY-4', 4, 'KEY-4', 5000, 'MOCK', 'SUCCESS', 'RES-4', '핫도그마스터 예약 4', '2026-03-19 20:16:00'),
(5, 7, 'PAY-5', 5, 'KEY-5', 8000, 'MOCK', 'REFUNDED', 'RES-5', '취소 예약 5', '2026-03-19 20:21:00');

-- -------------------------------
-- 10) Payment Refunds (예시)
-- -------------------------------
-- 추가 환불 데이터
INSERT INTO payment_refunds (id, payment_id, amount, reason, status, completed_at)
VALUES
-- 부분 환불 (정상 매출 포함되어야 함)
(2, 2, 6000, '부분 환불', 'COMPLETED', '2026-03-19 21:00:00'),

-- 요청 상태 (매출에서 제외되면 안됨)
(3, 3, 9500, '환불 요청', 'REQUESTED', NULL),

-- 실패 환불 (매출 영향 없음)
(4, 4, 5000, '환불 실패', 'FAILED', NULL);