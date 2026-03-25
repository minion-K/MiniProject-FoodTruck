import type { OrderSource } from "../order/order.type";

export interface DashboardResponse {
  totalSales: number;
  orderCount: number;
  reservationCount: number;
}

export interface WeeklySalesResponse {
  date: string;
  sales: number;
}

export type WeeklySalesResponseList = WeeklySalesResponse[];

export interface TopMenuResponse {
  menuName: string;
  totalQty: number;
}

export type TopMenuListResponse = TopMenuResponse[];

export interface ScheduleSalesResponse {
  scheduleId: number;
  locationName: string;
  startTime: string;
  sales: number;
}

export interface ScheduleSalesResponseList {
  content: ScheduleSalesResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ScheduleDetailResponse {
  orderType: OrderTypeListResponse;
  topMenu: TopMenuListResponse;
  timeSlot: TimeSlotListResponse;
}

export interface RefundResponse {
  refundCount: number;
}

export interface OrderTypeResponse {
  type: OrderSource;
  count: number;
}

export type OrderTypeListResponse = OrderTypeResponse[];

export interface TimeSlotResponse {
  timeSlot: string
  count: number;
}

export type TimeSlotListResponse = TimeSlotResponse[];
