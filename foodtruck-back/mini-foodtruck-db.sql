
DROP DATABASE IF EXISTS `mini-foodtruck-db`;
CREATE DATABASE IF NOT EXISTS `mini-foodtruck-db`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `mini-foodtruck-db`;

-- 드랍 순서(FK 역순)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS truck_schedules;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS trucks;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1) 사용자/권한
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  login_id VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT `uk_users_login_id` UNIQUE(login_id),
  CONSTRAINT `uk_users_email` UNIQUE(email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE roles (
  role_name VARCHAR(30) PRIMARY KEY
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO roles values ('USER');
INSERT INTO roles values ('MANAGER');
INSERT INTO roles values ('ADMIN');

CREATE TABLE user_roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  role_name VARCHAR(30) NOT NULL,
  UNIQUE KEY `uk_user_roles_user_id_role_name` (user_id, role_name),
  CONSTRAINT `fk_user_roles_user_id` FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT `fk_user_roles_role_name` FOREIGN KEY (role_name) REFERENCES roles(role_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS refresh_tokens (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
	token VARCHAR(350) NOT NULL,
	expiry DATETIME(6) NOT NULL,
    
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    INDEX `idx_refresh_tokens_user_id` (user_id),
    
    CONSTRAINT `fk_refresh_token_user` FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2) 트럭/위치/스케줄
CREATE TABLE trucks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  owner_id BIGINT NOT NULL,                   -- 운영자(유저)
  name VARCHAR(100) NOT NULL,
  cuisine VARCHAR(50) NULL,                   -- 푸드 장르
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE/INACTIVE
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT `fk_trucks_owner_id` FOREIGN KEY (owner_id) REFERENCES users(id),
  CONSTRAINT `chk_trucks_status` CHECK (status IN ('ACTIVE','INACTIVE')),
  UNIQUE KEY `uk_trucks_owner_name` (owner_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE locations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,                 -- 스팟명(예: OO공원 입구)
  address VARCHAR(255) NULL,
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  INDEX `idx_locations_geo` (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE truck_schedules (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  truck_id BIGINT NOT NULL,
  location_id BIGINT NOT NULL,
  start_time DATETIME(6) NOT NULL,
  end_time DATETIME(6) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PLANNED', -- PLANNED/OPEN/CLOSED/CANCELED
  max_reservations INT NOT NULL DEFAULT 100,     -- 사전예약 상한
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT `fk_truck_schedules_turck_id` FOREIGN KEY (truck_id) REFERENCES trucks(id),
  CONSTRAINT `fk_truck_schedules_location_id` FOREIGN KEY (location_id) REFERENCES locations(id),
  CONSTRAINT `chk_schedule_status` CHECK (status IN ('PLANNED','OPEN','CLOSED','CANCELED')),
  INDEX `idx_schedule_time` (start_time, end_time),
  INDEX `idx_schedule_truck` (truck_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3) 메뉴/예약
CREATE TABLE menu_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  truck_id BIGINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  price INT NOT NULL,
  is_sold_out BOOLEAN NOT NULL DEFAULT FALSE,
  option_text VARCHAR(255) NULL,              -- 간단 옵션 설명(세부 옵션 테이블은 생략)
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  FOREIGN KEY `fk_truck_menu_menu_item`(truck_id) REFERENCES trucks(id),
  UNIQUE KEY `uk_menu_item_truck_name` (truck_id, name),
  INDEX `idx_menu_truck` (truck_id, is_sold_out)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reservations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  schedule_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  pickup_time DATETIME(6) NOT NULL,
  total_amount INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING/CONFIRMED/CANCELED/NO_SHOW/REFUNDED
  note VARCHAR(255) NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  FOREIGN KEY `fk_resv_schedule`(schedule_id) REFERENCES truck_schedules(id),
  FOREIGN KEY `fk_resv_user`(user_id) REFERENCES users(id),
  CONSTRAINT `chk_resv_status` CHECK (status IN ('PENDING','CONFIRMED','CANCELED','NO_SHOW','REFUNDED')),
  INDEX `idx_resv_user_time` (user_id, pickup_time),
  INDEX `idx_resv_schedule` (schedule_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4) 주문(현장/사전 공용) + 품목
CREATE TABLE orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  schedule_id BIGINT NOT NULL,
  user_id BIGINT NULL,                         -- 비회원 현장주문 가능 시 NULL 허용
  source VARCHAR(20) NOT NULL DEFAULT 'ONSITE',-- ONSITE/RESERVATION
  reservation_id BIGINT NULL,
  amount INT NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'KRW',
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',  -- PAID/PENDING/FAILED/REFUNDED
  paid_at DATETIME(6) NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT `fk_order_truck_schedule` FOREIGN KEY (schedule_id) REFERENCES truck_schedules(id),
  CONSTRAINT `fk_order_user` FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT `fk_order_reservation` FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE SET NULL,
  CONSTRAINT `chk_order_status` CHECK (status IN ('PAID','PENDING','FAILED','REFUNDED')),
  CONSTRAINT `chk_order_source` CHECK (source IN ('ONSITE','RESERVATION')),
  INDEX `idx_orders_schedule` (schedule_id, status),
  INDEX `idx_orders_user` (user_id, paid_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  menu_item_id BIGINT NOT NULL,
  qty INT NOT NULL,
  unit_price INT NOT NULL,
  CONSTRAINT `fk_order_item_order` FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT `fk_order_item_menu_item` FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
  INDEX `idx_order_items_order` (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테스트----------------------------------------------- 
SELECT * FROM order_items;
SELECT * FROM orders;
SELECT * FROM reservations;
SELECT * FROM menu_items;
SELECT * FROM truck_schedules;
SELECT * FROM locations;
SELECT * FROM trucks;
SELECT * FROM user_roles;
SELECT * FROM roles;
SELECT * FROM users;

USE `mini-foodtruck-db`;