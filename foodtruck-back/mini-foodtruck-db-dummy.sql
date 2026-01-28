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
TRUNCATE TABLE refresh_tokens;
SET FOREIGN_KEY_CHECKS = 1;

-- 1) 위치
INSERT INTO locations (id, name, address, latitude, longitude)
VALUES
(1, '서면역 7번 출구', '부산 부산진구 부전동', 35.157667, 129.059939),
(2, '서면 롯데백화점 입구', '부산 부산진구 부전동', 35.158432, 129.059123),
(3, '부산시민공원', '부산 부산진구 전포동', 35.155678, 129.058901);

-- 2) 트럭
INSERT INTO trucks (id, owner_id, name, cuisine, status)
VALUES
(1, 2, '김밥천국', '한식', 'ACTIVE'),
(2, 2, '부산타코', '멕시칸', 'ACTIVE'),
(3, 2, '커피한잔', '카페', 'ACTIVE');

-- 3) 스케줄 (예약 테스트 최적화)
INSERT INTO truck_schedules
(id, truck_id, location_id, start_time, end_time, status, max_reservations)
VALUES
-- 🔥 메인 예약 테스트용 (지금부터 2~6시간)
(1, 1, 1, DATE_ADD(NOW(), INTERVAL 2 HOUR), DATE_ADD(NOW(), INTERVAL 6 HOUR), 'OPEN', 10),

-- 예약 거의 찬 상태 테스트
(2, 1, 2, DATE_ADD(NOW(), INTERVAL 3 HOUR), DATE_ADD(NOW(), INTERVAL 7 HOUR), 'OPEN', 3),

-- 다른 트럭 정상 OPEN
(3, 2, 2, DATE_ADD(NOW(), INTERVAL 2 HOUR), DATE_ADD(NOW(), INTERVAL 5 HOUR), 'OPEN', 20),

-- 과거 CLOSED (목록 필터 테스트용)
(4, 2, 3, DATE_SUB(NOW(), INTERVAL 6 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR), 'CLOSED', 20),

-- 오늘 하루 종일 OPEN
(5, 3, 3, DATE_ADD(CURDATE(), INTERVAL 10 HOUR), DATE_ADD(CURDATE(), INTERVAL 20 HOUR), 'OPEN', 50);

-- 4) 메뉴
INSERT INTO menu_items (id, truck_id, name, price, is_sold_out)
VALUES
(1, 1, '참치김밥', 3500, FALSE),
(2, 1, '계란김밥', 3000, FALSE),
(3, 2, '타코세트', 8000, FALSE),
(4, 2, '부리토', 9000, FALSE),
(5, 3, '아메리카노', 4000, FALSE),
(6, 3, '카페라떼', 4500, FALSE);

-- 5) 예약 (OPEN 스케줄 기준)
INSERT INTO reservations
(id, schedule_id, user_id, pickup_time, total_amount, status, note)
VALUES
-- 정상 CONFIRMED
(1, 1, 1, DATE_ADD(NOW(), INTERVAL 3 HOUR), 6500, 'CONFIRMED', '참치김밥 1, 계란김밥 1'),

-- PENDING (승인 대기)
(2, 1, 1, DATE_ADD(NOW(), INTERVAL 4 HOUR), 3500, 'PENDING', NULL),

-- 거의 찬 스케줄
(3, 2, 1, DATE_ADD(NOW(), INTERVAL 4 HOUR), 3500, 'CONFIRMED', NULL),
(4, 2, 1, DATE_ADD(NOW(), INTERVAL 5 HOUR), 3000, 'CONFIRMED', NULL);

-- 6) 예약 아이템
INSERT INTO reservation_items
(id, reservation_id, menu_item_id, menu_name, price, qty)
VALUES
(1, 1, 1, '참치김밥', 3500, 1),
(2, 1, 2, '계란김밥', 3000, 1),
(3, 2, 1, '참치김밥', 3500, 1),
(4, 3, 1, '참치김밥', 3500, 1),
(5, 4, 2, '계란김밥', 3000, 1);

-- 7) 주문
INSERT INTO orders
(id, schedule_id, user_id, source, reservation_id, amount, currency, status, paid_at)
VALUES
(1, 1, 1, 'RESERVATION', 1, 6500, 'KRW', 'PAID', DATE_ADD(NOW(), INTERVAL 3 HOUR)),
(2, 5, NULL, 'ONSITE', NULL, 4500, 'KRW', 'PENDING', NULL);

-- 8) 주문 아이템
INSERT INTO order_items
(id, order_id, menu_item_id, qty, unit_price)
VALUES
(1, 1, 1, 1, 3500),
(2, 1, 2, 1, 3000),
(3, 2, 6, 1, 4500);
