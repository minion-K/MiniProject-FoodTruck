import type { PaymentStatus } from "../payment/payment.type";
import type { OrderSource, OrderStatus } from "./order.type";

export interface CreateOrderItemRequest {
  menuItemId: number;
  qty: number;
}

export interface UpdateOrderItemRequest {
  menuItemId: number;
  qty: number;
}

export interface OrderCreateReqeust {
  scheduleId: number;
  reservationId?: number;
  source: OrderSource;
  menus: CreateOrderItemRequest[];
}

export interface OrderUpdateReqeust {
  items: UpdateOrderItemRequest[];
}

export interface OrderItemResponse {
  menuItemId: number;
  menuItemName: String;
  qty: number;
  unitPrice: number;
}

export interface AdminOrderListItemResponse {
  id: number;
  truckName: string
  username?: string;
  startTime: string;
  endTime: string;
  source: OrderSource;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  currency: string;
  createdAt: string;
  items: OrderItemResponse[]
}

export interface AdminOrderListResponse {
  content: AdminOrderListItemResponse[];
  totalPage: number;
  totalElement: number;
  number: number;
}

export interface OwnerOrderListItemResponse {
  id: number;
  scheduleId: number;
  username?: String;
  source: OrderSource;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  currency: string;
  menus: OrderItemResponse[];
  createdAt: string;
}

export interface OwnerOrderListResponse {
  content: OwnerOrderListItemResponse[];
  totalPage: number;
  totalElement: number;
  number: number;
}

export interface UserOrderListResponse {
  id: number;
  scheduleId: number;
  userId?: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  currency: string;
  createdAt: string;
}

export interface OrderDetailResponse {
  id: number;
  scheduleId: number;
  userId?: number;
  username?: string;
  reservationId?: number;
  source: OrderSource;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  note: string;
  amount: number;
  currency: string;
  paidAt?: string;
  createdAt: string;
  updateAt: string;

  menus: OrderItemResponse[];
}