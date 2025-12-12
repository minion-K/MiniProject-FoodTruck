import type { CreateOrderItem, OrderItem, OrderSource, OrderStatus, UpdateOrderItem } from "./order.type";

export interface OrderCreateRequest {
  scheduleId: number;
  userId?: number | null
  source: OrderSource;
  reservationId?: number | null;
  items: CreateOrderItem[];
}

export interface OrderUpdateRequest {
  items: UpdateOrderItem[];
}

export interface OrderDetailResponse {
  id: number;
  scheduleId: number;
  userId: number | null;
  source: OrderSource;
  reservationId: number | null;
  amount: number;
  currency: "KRW";
  status: OrderStatus;

  paidAt: string | null;
  createdAt: string;
  updatedAt: string;

  items: OrderItem[];
}

export interface OrderListItemResponse {
  id: number;
  scheduleId: number;
  userId: number | null;
  source: OrderSource;
  amount: number;
  status: OrderStatus;
  createdAt: string;
}

export type OrderListResponse = OrderListItemResponse[];