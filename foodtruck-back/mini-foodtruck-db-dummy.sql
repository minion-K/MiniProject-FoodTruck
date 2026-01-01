USE `mini-foodtruck-db`;

SET FOREIGN_KEY_CHECKS = 0;

-- ===============================
-- 기존 데이터 전체 삭제 (FK 역순)
-- ===============================
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE reservations;
TRUNCATE TABLE menu_items;
TRUNCATE TABLE truck_schedules;
TRUNCATE TABLE locations;
TRUNCATE TABLE trucks;
TRUNCATE TABLE refresh_tokens;
TRUNCATE TABLE user_roles;
-- users / roles 는 유지 (1=USER, 2=OWNER, 3=ADMIN 존재 가정)

SET FOREIGN_KEY_CHECKS = 1;

-- ===============================
-- 1. 트럭 (owner_id = 2)
-- ===============================
INSERT INTO trucks (id, owner_id, name, cuisine, status)
VALUES
  (1, 2, '서면 떡볶이 트럭', 'KOREAN', 'ACTIVE'),
  (2, 2, '부산 핫도그 트럭', 'FASTFOOD', 'ACTIVE'),
  (3, 2, '서면 타코 트럭', 'MEXICAN', 'ACTIVE'),
  (4, 2, '야시장 꼬치 트럭', 'GRILL', 'INACTIVE');

-- ===============================
-- 2. 위치 (부산 서면 인근)
-- ===============================
INSERT INTO locations (id, name, address, latitude, longitude)
VALUES
  (1, '서면역 1번 출구', '부산 부산진구 부전동', 35.1579, 129.0596),
  (2, '서면 젊음의 거리', '부산 부산진구 중앙대로', 35.1586, 129.0604),
  (3, '부전시장 입구', '부산 부산진구 부전시장길', 35.1592, 129.0579),
  (4, '송상현광장', '부산 부산진구 시민공원로', 35.1610, 129.0609);

-- ===============================
-- 3. 트럭 스케줄 (상태 다양)
-- ===============================
INSERT INTO truck_schedules
(id, truck_id, location_id, start_time, end_time, status, max_reservations)
VALUES
  -- 트럭 1 : 현재 OPEN
  (1, 1, 1,
   DATE_SUB(NOW(), INTERVAL 1 HOUR),
   DATE_ADD(NOW(), INTERVAL 4 HOUR),
   'OPEN', 50),

  -- 트럭 1 : 과거 CLOSED
  (2, 1, 2,
   DATE_SUB(NOW(), INTERVAL 6 HOUR),
   DATE_SUB(NOW(), INTERVAL 2 HOUR),
   'CLOSED', 50),

  -- 트럭 2 : 현재 OPEN
  (3, 2, 2,
   DATE_SUB(NOW(), INTERVAL 30 MINUTE),
   DATE_ADD(NOW(), INTERVAL 3 HOUR),
   'OPEN', 30),

  -- 트럭 2 : 미래 PLANNED
  (4, 2, 3,
   DATE_ADD(NOW(), INTERVAL 1 DAY),
   DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 4 HOUR,
   'PLANNED', 40),

  -- 트럭 3 : 현재 OPEN
  (5, 3, 4,
   DATE_SUB(NOW(), INTERVAL 2 HOUR),
   DATE_ADD(NOW(), INTERVAL 5 HOUR),
   'OPEN', 60),

  -- 트럭 4 : INACTIVE + PLANNED
  (6, 4, 1,
   DATE_ADD(NOW(), INTERVAL 1 DAY),
   DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 3 HOUR,
   'PLANNED', 20);

-- ===============================
-- 4. 메뉴
-- ===============================
INSERT INTO menu_items (id, truck_id, name, price, is_sold_out)
VALUES
  (1, 1, '국물 떡볶이', 4000, FALSE),
  (2, 1, '치즈 떡볶이', 5000, FALSE),
  (3, 1, '순대 세트', 6000, TRUE),
  (4, 2, '클래식 핫도그', 3500, FALSE),
  (5, 2, '치즈 핫도그', 4500, FALSE),
  (6, 3, '비프 타코', 5000, FALSE),
  (7, 3, '치킨 타코', 4800, FALSE);

-- ===============================
-- 5. 예약 (user_id = 1)
-- ===============================
INSERT INTO reservations
(id, schedule_id, user_id, pickup_time, total_amount, status, note)
VALUES
  (1, 1, 1,
   DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-%d %H:00:00'), INTERVAL 1 HOUR),
   8000, 'PENDING', '덜 맵게'),

  (2, 1, 1,
   DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-%d %H:00:00'), INTERVAL 2 HOUR),
   5000, 'CONFIRMED', NULL),

  (3, 3, 1,
   DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-%d %H:00:00'), INTERVAL 1 HOUR),
   3500, 'CANCELED', '사정으로 취소');

-- ===============================
-- 6. 주문 (currency 명시!!)
-- ===============================
INSERT INTO orders
(id, schedule_id, user_id, source, reservation_id, amount, currency, status, paid_at)
VALUES
  (1, 1, 1, 'RESERVATION', 2, 5000, 'KRW', 'PAID', NOW()),
  (2, 3, 1, 'ONSITE', NULL, 3500, 'KRW', 'PAID', NOW()),
  (3, 1, 1, 'RESERVATION', 1, 8000, 'KRW', 'PENDING', NULL);

-- ===============================
-- 7. 주문 아이템
-- ===============================
INSERT INTO order_items
(id, order_id, menu_item_id, qty, unit_price)
VALUES
  (1, 1, 2, 1, 5000),
  (2, 2, 4, 1, 3500),
  (3, 3, 1, 2, 4000);
