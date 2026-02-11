USE `mini-foodtruck-db`;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE payment_refunds;
TRUNCATE TABLE payments;
TRUNCATE TABLE reservation_items;
TRUNCATE TABLE reservations;
TRUNCATE TABLE menu_items;
TRUNCATE TABLE truck_schedules;
TRUNCATE TABLE locations;
TRUNCATE TABLE trucks;
TRUNCATE TABLE refresh_tokens;

SET FOREIGN_KEY_CHECKS = 1;

-- 1) 위치 (부산 서면)
INSERT INTO locations (id, name, address, latitude, longitude)
VALUES
(1, '서면역 7번 출구', '부산 부산진구 부전동', 35.157667, 129.059939),
(2, '서면 롯데백화점 입구', '부산 부산진구 부전동', 35.158432, 129.059123);

-- 2) 트럭
INSERT INTO trucks (id, owner_id, name, cuisine, status)
VALUES
(1, 2, '김밥천국', '한식', 'ACTIVE'),
(2, 2, '부산타코', '멕시칸', 'ACTIVE');

-- 3) 스케줄 🔥 지금 진행 중 (예약 가능)
INSERT INTO truck_schedules
(id, truck_id, location_id, start_time, end_time, status, max_reservations)
VALUES
-- 김밥천국: 지금 예약 가능
(1, 1, 1,
 DATE_SUB(NOW(), INTERVAL 1 HOUR),
 DATE_ADD(NOW(), INTERVAL 4 HOUR),
 'OPEN', 10),

-- 부산타코: 지금 예약 가능
(2, 2, 2,
 DATE_SUB(NOW(), INTERVAL 30 MINUTE),
 DATE_ADD(NOW(), INTERVAL 3 HOUR),
 'OPEN', 5);

-- 4) 메뉴
INSERT INTO menu_items (id, truck_id, name, price, is_sold_out)
VALUES
(1, 1, '참치김밥', 3500, FALSE),
(2, 1, '계란김밥', 3000, FALSE),
(3, 2, '타코세트', 8000, FALSE),
(4, 2, '부리토', 9000, FALSE);

-- 5) 예약 🔥 실제 존재
INSERT INTO reservations
(id, schedule_id, user_id, pickup_time, total_amount, status, note)
VALUES
-- 김밥천국 예약 (PENDING)
(1, 1, 1,
 DATE_ADD(NOW(), INTERVAL 1 HOUR),
 6500, 'PENDING', NULL),

-- 김밥천국 예약 (CONFIRMED)
(2, 1, 1,
 DATE_ADD(NOW(), INTERVAL 2 HOUR),
 3500, 'CONFIRMED', NULL),

-- 부산타코 예약 (CANCELED)
(3, 2, 1,
 DATE_ADD(NOW(), INTERVAL 1 HOUR),
 8000, 'CANCELED', '사용자 취소');

-- 6) 예약 아이템
INSERT INTO reservation_items
(id, reservation_id, menu_item_id, menu_name, price, qty)
VALUES
(1, 1, 1, '참치김밥', 3500, 1),
(2, 1, 2, '계란김밥', 3000, 1),
(3, 2, 1, '참치김밥', 3500, 1),
(4, 3, 3, '타코세트', 8000, 1);