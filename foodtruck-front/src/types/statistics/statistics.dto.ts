import type { OrderSource } from "../order/order.type";
import type { PaymentStatus } from "../payment/payment.type";

// == owner == 
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


// == admin ==
export interface AdminDashboardResponse {
  totalRevenue: number;
  totalOrders: number;
  totalReservations: number;
  totalRefunds: number;
  totalUsers: number;
  activeTrucks: number;
  conversionRate: number;

  revenueChangeRate: number
  orderChangeRate: number
  reservationChangeRate: number
  refundChangeRate: number
  userChangeRate: number
  truckChangeRate: number
  conversionChangeRate: number
}

export interface AdminGrowthTrendResponse {
  date: string;
  revenue: number;
  orderCount: number;
  userCount: number;
  truckCount: number;
}

export type AdminGrowthTrendListResponse = AdminGrowthTrendResponse[];

export interface AdminConversionFunnelResponse{
  reservations: number;
  confirmedReservations: number;
  orders: number;
  paidOrders: number;
  reservationToOrderRate: number;
  orderToPaymentRate: number;
}

export interface AdminPaymentStatusResponse {
  status: PaymentStatus,
  count: number;
  amount: number;
}

export type AdminPaymentStatusListResponse = AdminPaymentStatusResponse[];

export interface AdminOrderTypesResponse {
  source: OrderSource;
  count: number;
}

export type AdminOrderTypesListResponse = AdminOrderTypesResponse[];

export interface AdminTopTruckResponse {
  truckId: number;
  truckName: string;
  revenue: number;
  orderCount: number;
  avgSalesPerOrder: number;
}

export type AdminTopTruckListResponse = AdminTopTruckResponse[]

export interface AdminTopMenuResponse {
  menuName: string;
  quantity: number;
  revenue: number;
}

export type AdminTopMenuListResponse = AdminTopMenuResponse[]

export interface AdminInsightResponse {
  category: string;
  title: string;
  description: string;
  value: number | string;
  unit: string | null;
}

export type AdminInsightListResponse = AdminInsightResponse[]