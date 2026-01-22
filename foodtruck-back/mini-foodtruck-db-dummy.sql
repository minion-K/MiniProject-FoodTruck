USE `mini-foodtruck-db`;

-- FK 고려해서 기존 데이터 삭제 (users 제외)
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

-- 1) 위치(Location) - 부산 서면 기준
INSERT INTO locations (id, name, address, latitude, longitude)
VALUES
(1, '서면역 7번 출구', '부산 부산진구 부전동', 35.157667, 129.059939),
(2, '서면 롯데백화점 입구', '부산 부산진구 부전동', 35.158432, 129.059123),
(3, '부산시민공원', '부산 부산진구 전포동', 35.155678, 129.058901);

-- 2) 트럭(Trucks) - owner_id는 2번 유저
INSERT INTO trucks (id, owner_id, name, cuisine, status)
VALUES
(1, 2, '김밥천국', '한식', 'ACTIVE'),
(2, 2, '부산타코', '멕시칸', 'ACTIVE'),
(3, 2, '커피한잔', '카페', 'ACTIVE');

-- 3) 트럭 스케줄(Truck Schedules) - 오늘 기준
INSERT INTO truck_schedules (id, truck_id, location_id, start_time, end_time, status, max_reservations)
VALUES
(1, 1, 1, NOW() + INTERVAL 1 HOUR, NOW() + INTERVAL 4 HOUR, 'OPEN', 50),
(2, 1, 2, NOW() + INTERVAL 5 HOUR, NOW() + INTERVAL 8 HOUR, 'PLANNED', 50),
(3, 2, 2, NOW() + INTERVAL 2 HOUR, NOW() + INTERVAL 5 HOUR, 'OPEN', 60),
(4, 2, 3, NOW() - INTERVAL 5 HOUR, NOW() - INTERVAL 2 HOUR, 'CLOSED', 60),
(5, 3, 3, NOW() + INTERVAL 0 HOUR, NOW() + INTERVAL 8 HOUR, 'OPEN', 100),
(6, 3, 1, NOW() + INTERVAL 9 HOUR, NOW() + INTERVAL 17 HOUR, 'PLANNED', 100);

-- 4) 메뉴(Menu Items)
INSERT INTO menu_items (id, truck_id, name, price, is_sold_out)
VALUES
(1, 1, '참치김밥', 3500, FALSE),
(2, 1, '계란김밥', 3000, FALSE),
(3, 2, '타코세트', 8000, FALSE),
(4, 2, '부리토', 9000, FALSE),
(5, 3, '아메리카노', 4000, FALSE),
(6, 3, '카페라떼', 4500, TRUE);

-- 5) 예약(Reservations)
INSERT INTO reservations (id, schedule_id, user_id, pickup_time, total_amount, status, note)
VALUES
(1, 1, 1, NOW() + INTERVAL 1 HOUR + INTERVAL 30 MINUTE, 6500, 'CONFIRMED', '참치김밥 1, 계란김밥 1'),
(2, 1, 1, NOW() + INTERVAL 2 HOUR, 3500, 'PENDING', NULL),
(3, 3, 1, NOW() + INTERVAL 3 HOUR, 8000, 'CANCELED', '부리토 변경 요청'),
(4, 5, 1, NOW() + INTERVAL 1 HOUR, 4000, 'CONFIRMED', '아메리카노 1');

-- 6) 예약 품목(Reservation Items)
INSERT INTO reservation_items (id, reservation_id, menu_item_id, menu_name, price, qty)
VALUES
(1, 1, 1, '참치김밥', 3500, 1),
(2, 1, 2, '계란김밥', 3000, 1),
(3, 2, 1, '참치김밥', 3500, 1),
(4, 3, 4, '부리토', 9000, 1),
(5, 4, 5, '아메리카노', 4000, 1);

-- 7) 주문(Orders)
INSERT INTO orders (id, schedule_id, user_id, source, reservation_id, amount, currency, status, paid_at)
VALUES
(1, 1, 1, 'RESERVATION', 1, 6500, 'KRW', 'PAID', NOW() + INTERVAL 1 HOUR + INTERVAL 35 MINUTE),
(2, 3, 1, 'RESERVATION', 3, 8000, 'KRW', 'REFUNDED', NOW() + INTERVAL 3 HOUR + INTERVAL 45 MINUTE),
(3, 5, NULL, 'ONSITE', NULL, 4500, 'KRW', 'PENDING', NULL);

-- 8) 주문 품목(Order Items)
INSERT INTO order_items (id, order_id, menu_item_id, qty, unit_price)
VALUES
(1, 1, 1, 1, 3500),
(2, 1, 2, 1, 3000),
(3, 2, 4, 1, 8000),
(4, 3, 6, 1, 4500);
