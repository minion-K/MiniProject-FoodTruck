export type OrderSource = "ONSITE" | "RESERVATION";
export type OrderStatus = "PAID" | "PENDING" | "FAILED" | "CANCELED" | "REFUNDED";

export interface CreateOrderItem {
  menuItemId: number;
  qty: number;
}

export interface UpdateOrderItem {
  menuItemId?: number;
  qty?: number;
}

export interface OrderItem {
  menuItemId: number;
  qty: number;
  unitPrice: number;
}