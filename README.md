# ⭐ MiniProject FoodTruck-Manager ⭐
## 푸드 트럭 운영 & 예약 관리
> 푸드 트럭 운영 & 예약 관리 웹 페이지

## 📢 개요 
🔹 이동형 푸드 트럭의 **영업 스케줄 공개**, 고객의 **사전 예약(픽업 시간 지정)** 및 **현장 주문**을 지원하는 경량 웹 서비스 구축
**MiniProject FoodTruck-Manager**는 이동형 푸드트럭의 운영 특성을 고려해,  
고객은 위치와 영업 스케줄을 확인한 뒤 시간 지정 예약과 픽업을 진행하고,  
운영자는 트럭, 메뉴, 품절 상태, 예약, 현장 주문, 통계를 한 번에 관리할 수 있도록 만든 서비스입니다.

줄서기 최소화와 운영 효율 개선이라는 문제를 해결하는 데 초점을 두고 설계했습니다.

### 🎯 핵심 목표
- 고객의 **대기 시간 최소화**
- 운영자의 **예약 / 주문 / 메뉴 / 품절 관리 통합**
- 위치 기반 푸드트럭 탐색 지원
- 결제 및 취소/환불 흐름 관리

## 🚀 주요 기능
👉 **대상 사용자**
- **고객(User)**: 근처 트럭 스케줄/메뉴 확인 → 시간 지정 예약 → 현장 픽업/결제(모의)
- **운영자(Owner)**: 본인 트럭/스케줄/메뉴/품절/예약 관리, 현장 주문 기록, 판매 통계 확인
- **관리자(Admin)**: 다수 트럭/운영자 계정/권한 관리, 강제 취소/환불, 모니터링

## 🛠 기술 스택
### Frontend
- React
- TypeScript
- Vite
- Material UI
- React Router DOM
- TanStack Query
- Axios
- Zustand
- Recharts

### Backend
- Java 17
- Spring Boot
- Spring Data JPA
- Spring Security
- JWT
- Validation
- Spring Mail
- Redis
- MySQL / H2

## 🧩 프로젝트 구조
MiniProject-FoodTruck
├── foodtruck-front # React + TypeScript
├── foodtruck-back # Spring Boot
└── README.md

## 🧠 설계 포인트

### 1) 위치 + 스케줄 기반 구조
푸드트럭은 고정 매장이 아니기 때문에  
트럭 / 위치 / 스케줄을 분리하여 관리하고 UI와 연결했습니다.

### 2) 예약 + 현장 주문 통합
예약과 현장 주문을 하나의 흐름으로 관리하여  
실제 운영 환경과 유사한 구조를 구현했습니다.

### 3) 역할 기반 분리
USER / OWNER / ADMIN 역할별로  
UI와 API 접근을 분리했습니다.

### 4) 결제/환불 흐름 포함
결제 성공 → 취소 → 환불까지  
전체 상태 흐름을 고려해 설계했습니다.


## 🗄 데이터 모델링

핵심 도메인:

- 사용자 / 권한: `users`, `roles`, `user_roles`
- 트럭 / 스케줄: `trucks`, `truck_schedules`
- 메뉴 / 예약: `menu_items`, `reservations`, `reservation_items`
- 주문 / 결제: `orders`, `order_items`, `payments`, `payment_refunds`

👉 예약 → 주문 → 결제 → 환불 흐름을 분리하여  
확장성과 데이터 정합성을 고려

## 📷 7. 실행 화면

### 👤 User Flow
- 메인 (지도 + 목록)
- 예약 화면
- 결제 화면

### 🚚 Owner
- 메뉴 관리
- 스케줄 관리
- 예약 관리

### 🛠 Admin
- 관리자 관리 페이지

### 📊 Statistics
- 운영자 통계
