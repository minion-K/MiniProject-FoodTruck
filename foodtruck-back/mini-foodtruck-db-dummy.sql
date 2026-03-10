USE `mini-foodtruck-db`;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE reservation_items;
TRUNCATE TABLE reservations;
TRUNCATE TABLE truck_schedules;
TRUNCATE TABLE menu_items;
TRUNCATE TABLE trucks;
TRUNCATE TABLE locations;

SET FOREIGN_KEY_CHECKS = 1;


-- =========================
-- 1️⃣ 위치 (서면)
-- =========================
INSERT INTO locations (id, name, address, latitude, longitude) VALUES
(1,'서면역 1번출구','부산 부산진구 중앙대로 742',35.157961,129.059206),
(2,'NC백화점 서면점 앞','부산 부산진구 동천로 92',35.155406,129.058639);


-- =========================
-- 2️⃣ 트럭 (owner_id = 2 유지)
-- =========================
INSERT INTO trucks (id, owner_id, name, cuisine, status) VALUES
(1,2,'서면김밥트럭','한식','ACTIVE'),
(2,2,'서면타코트럭','멕시칸','ACTIVE');


-- =========================
-- 3️⃣ 메뉴
-- =========================
INSERT INTO menu_items (id, truck_id, name, price) VALUES
(1,1,'참치김밥',3500),
(2,1,'계란김밥',3000),
(3,1,'치즈김밥',4000),
(4,2,'타코세트',8000),
(5,2,'부리토',9000);


-- =========================
-- 4️⃣ 스케줄
-- =========================
INSERT INTO truck_schedules
(id, truck_id, location_id, start_time, end_time, status, max_reservations)
VALUES
(1,1,1, DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_ADD(NOW(), INTERVAL 4 HOUR),'OPEN',20),
(2,2,2, DATE_ADD(NOW(), INTERVAL 2 HOUR), DATE_ADD(NOW(), INTERVAL 6 HOUR),'OPEN',15);


-- =========================
-- 5️⃣ 예약 (menuSummary 테스트용)
-- =========================
INSERT INTO reservations
(id, schedule_id, user_id, pickup_time, total_amount, status)
VALUES
-- 🔵 케이스1: 메뉴 없음
(1,1,1, DATE_ADD(NOW(), INTERVAL 1 HOUR), 0,'PENDING'),

-- 🔵 케이스2: 메뉴 1개 수량 1
(2,1,4, DATE_ADD(NOW(), INTERVAL 1 HOUR), 3500,'PENDING'),

-- 🔵 케이스3: 메뉴 1개 수량 2
(3,1,5, DATE_ADD(NOW(), INTERVAL 2 HOUR), 7000,'PENDING'),

-- 🔵 케이스4: 메뉴 2개
(4,1,6, DATE_ADD(NOW(), INTERVAL 2 HOUR), 6500,'CONFIRMED'),

-- 🔵 케이스5: 메뉴 3개
(5,2,7, DATE_ADD(NOW(), INTERVAL 3 HOUR), 20000,'CONFIRMED');


-- =========================
-- 6️⃣ 예약 아이템
-- =========================
INSERT INTO reservation_items
(reservation_id, menu_item_id, menu_name, price, qty)
VALUES

-- 예약2 (1개 1개)
(2,1,'참치김밥',3500,1),

-- 예약3 (1개 2개)
(3,1,'참치김밥',3500,2),

-- 예약4 (2개 메뉴)
(4,1,'참치김밥',3500,1),
(4,2,'계란김밥',3000,1),

-- 예약5 (3개 메뉴)
(5,4,'타코세트',8000,1),
(5,5,'부리토',9000,1),
(5,1,'참치김밥',3500,1);
