export interface DashboardResponse {
  todaySales: number;
  todayOrders: number;
  todayReservations: number;
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

export type TopMenuResponseList = TopMenuResponse[];

export interface ScheduleSalesResponse {
  scheduleId: number;
  locationName: string;
  startTime: string;
  sales: number;
}

export type ScheduleSalesResponseList = ScheduleSalesResponse[];

export interface ScheduleDetailResponse {
  orderCount: number;
  reservationCount: number;
  totalSales: number;
}

export interface RefundResponse {
  refundCount: number;
}