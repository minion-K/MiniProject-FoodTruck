USE `mini-foodtruck-db`;

SET FOREIGN_KEY_CHECKS = 0;

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

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- 1. 유저 추가 (1,2,3 유지 → 4부터 생성)
-- ========================================
INSERT INTO users (id, name, login_id, password, email, phone, verified, status, provider)
VALUES
(4,'유저4','user4','1234','user4@test.com','010-0000-0004',TRUE,'ACTIVE','LOCAL'),
(5,'유저5','user5','1234','user5@test.com','010-0000-0005',TRUE,'ACTIVE','LOCAL'),
(6,'유저6','user6','1234','user6@test.com','010-0000-0006',TRUE,'ACTIVE','LOCAL'),
(7,'유저7','user7','1234','user7@test.com','010-0000-0007',TRUE,'ACTIVE','LOCAL'),
(8,'유저8','user8','1234','user8@test.com','010-0000-0008',TRUE,'ACTIVE','LOCAL'),
(9,'유저9','user9','1234','user9@test.com','010-0000-0009',TRUE,'ACTIVE','LOCAL'),
(10,'유저10','user10','1234','user10@test.com','010-0000-0010',TRUE,'ACTIVE','LOCAL');

-- 역할
INSERT INTO user_roles (user_id, role_name) VALUES
(4,'USER'),(5,'USER'),(6,'USER'),(7,'USER'),
(8,'USER'),(9,'USER'),(10,'USER');

-- ========================================
-- 2. 위치
-- ========================================
INSERT INTO locations (name, address, latitude, longitude) VALUES
('해운대','부산',35.1587,129.1600),
('광안리','부산',35.1530,129.1180),
('서면','부산',35.1580,129.0600),
('홍대','서울',37.5570,126.9250);

-- ========================================
-- 3. 트럭 (owner = 2,3)
-- ========================================
INSERT INTO trucks (owner_id, name, cuisine)
VALUES
(2,'김밥트럭','Korean'),
(2,'타코트럭','Mexican'),
(3,'파스타트럭','Italian'),
(3,'버거트럭','American');

-- ========================================
-- 4. 스케줄 (id 1~8 보장)
-- ========================================
INSERT INTO truck_schedules (truck_id, location_id, start_time, end_time, status)
VALUES
(1,1,'2026-04-03 11:00','2026-04-03 20:00','OPEN'),
(2,2,'2026-04-03 12:00','2026-04-03 21:00','OPEN'),
(3,3,'2026-04-03 11:00','2026-04-03 20:00','OPEN'),
(4,4,'2026-04-03 12:00','2026-04-03 21:00','OPEN'),

(1,1,'2026-04-02 11:00','2026-04-02 20:00','CLOSED'),
(2,2,'2026-04-02 12:00','2026-04-02 21:00','CLOSED'),
(3,3,'2026-04-02 11:00','2026-04-02 20:00','CLOSED'),
(4,4,'2026-04-02 12:00','2026-04-02 21:00','CLOSED');

-- ========================================
-- 5. 메뉴
-- ========================================
INSERT INTO menu_items (truck_id,name,price) VALUES
(1,'김밥',4000),(1,'라면',6000),
(2,'타코',7000),(2,'부리토',8000),
(3,'파스타',12000),(3,'피자',15000),
(4,'버거',9000),(4,'감튀',4000);

-- ========================================
-- 6. 예약 (schedule_id 1~8만 사용)
-- ========================================
INSERT INTO reservations (schedule_id,user_id,pickup_time,total_amount,status)
VALUES
(1,4,'2026-04-03 12:00',12000,'CONFIRMED'),
(2,5,'2026-04-03 13:00',15000,'CONFIRMED'),
(3,6,'2026-04-03 14:00',20000,'CONFIRMED'),
(4,7,'2026-04-03 15:00',18000,'CONFIRMED'),

(5,8,'2026-04-02 12:00',10000,'CONFIRMED'),
(6,9,'2026-04-02 13:00',13000,'CONFIRMED'),
(7,10,'2026-04-02 14:00',17000,'CONFIRMED'),
(8,4,'2026-04-02 15:00',16000,'CONFIRMED');

-- ========================================
-- 7. 예약 아이템
-- ========================================
INSERT INTO reservation_items (reservation_id,menu_item_id,menu_name,price,qty)
VALUES
(1,1,'김밥',4000,2),
(2,3,'타코',7000,2),
(3,5,'파스타',12000,1),
(4,7,'버거',9000,2),
(5,1,'김밥',4000,2),
(6,3,'타코',7000,1),
(7,5,'파스타',12000,1),
(8,7,'버거',9000,1);

-- ========================================
-- 8. 주문
-- ========================================
INSERT INTO orders (schedule_id,user_id,source,reservation_id,amount,status,paid_at)
VALUES
(1,4,'RESERVATION',1,12000,'PAID','2026-04-03 12:10'),
(2,5,'RESERVATION',2,15000,'PAID','2026-04-03 13:10'),
(3,NULL,'ONSITE',NULL,9000,'PAID','2026-04-03 14:10'),
(4,7,'RESERVATION',4,18000,'PAID','2026-04-03 15:10'),

(5,8,'RESERVATION',5,10000,'PAID','2026-04-02 12:10'),
(6,NULL,'ONSITE',NULL,8000,'PAID','2026-04-02 13:10');

-- ========================================
-- 9. 주문 아이템
-- ========================================
INSERT INTO order_items (order_id,menu_item_id,menu_name,qty,unit_price)
VALUES
(1,1,'김밥',2,4000),
(2,3,'타코',2,7000),
(3,7,'버거',1,9000),
(4,7,'버거',2,9000),
(5,1,'김밥',2,4000),
(6,7,'버거',1,8000);

-- ========================================
-- 10. 결제
-- ========================================
INSERT INTO payments (user_id,payment_order_id,order_id,payment_key,amount,method,status,product_code,product_name)
VALUES
(4,'PO-1',NULL,'PAY-1',12000,'TOSS_PAY','SUCCESS','RES-1','예약'),
(5,'PO-2',NULL,'PAY-2',15000,'TOSS_PAY','SUCCESS','RES-2','예약'),
(NULL,'PO-3',3,'PAY-3',9000,'TOSS_PAY','SUCCESS','ORD-3','현장');

-- ========================================
-- 11. 환불
-- ========================================
INSERT INTO payment_refunds (payment_id,amount,reason,status)
VALUES
(1,12000,'고객 요청','COMPLETED');

-- ========================================
-- 검증
-- ========================================
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM reservations;
SELECT COUNT(*) FROM orders;
SELECT COUNT(*) FROM payments;