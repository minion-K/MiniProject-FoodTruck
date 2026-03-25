import type { DashboardResponse, OrderTypeListResponse, RefundResponse, ScheduleDetailResponse, ScheduleSalesResponseList, TopMenuListResponse, WeeklySalesResponseList,  } from "@/types/statistics/statistics.dto";
import { privateApi } from "../common/axiosInstance";
import { type ApiResponse } from "@/types/common/ApiResponse";
import { STATISTICS_PATH } from "./statistics.path";

export const statisticsApi = {
  getDashboard: async (
    fromDate: string,
    toDate: string,
    truckId?: number
  ): Promise<DashboardResponse> => {
    const res = await privateApi.get<ApiResponse<DashboardResponse>>(
      STATISTICS_PATH.DASHBOARD,
      {params: {truckId, fromDate, toDate}}
    );

    return res.data.data;
  },

  getWeeklySales: async (
    fromDate: string,
    toDate: string,
    truckId?: number,
  ): Promise<WeeklySalesResponseList> => {
    const res = await privateApi.get<ApiResponse<WeeklySalesResponseList>>(
      STATISTICS_PATH.WEEKLY_SALES,
      {params: {truckId, fromDate, toDate}}
    );

    return res.data.data ?? [];
  },

  getTopMenus: async (
    fromDate: string,
    toDate: string,
    truckId?: number
  ): Promise<TopMenuListResponse> => {
    const res = await privateApi.get<ApiResponse<TopMenuListResponse>>(
      STATISTICS_PATH.TOP_MENUS,
      {params: {truckId, fromDate, toDate}}
    );

    return res.data.data ?? [];
  },

  getSchedules: async (
    fromDate: string,
    toDate: string,
    truckId?: number, 
    page: number = 0, 
    size: number = 10
  ): Promise<ScheduleSalesResponseList> => {
    const res = await privateApi.get<ApiResponse<ScheduleSalesResponseList>>(
      STATISTICS_PATH.SCHEDULES,
      {params: {truckId, fromDate, toDate, page, size}}
    );

    return res.data.data ?? [];
  },

  getSchedulesDetail: async (scheduleId: number): Promise<ScheduleDetailResponse> => {
    const res = await privateApi.get<ApiResponse<ScheduleDetailResponse>>(
      STATISTICS_PATH.SCHEDULES_DETAIL(scheduleId),

    );

    return res.data.data;
  },

  getRefundCount: async (
    fromDate: string,
    toDate: string,
    truckId?: number
  ): Promise<RefundResponse> => {
    const res = await privateApi.get<ApiResponse<RefundResponse>>(
      STATISTICS_PATH.REFUNDCOUNT,
      {params: {truckId, fromDate, toDate}}
    );

    return res.data.data;
  },

  getOrderTypes: async (
    fromDate: string,
    toDate: string,
    truckId?: number
  ):Promise<OrderTypeListResponse> => {
    const res = await privateApi.get<ApiResponse<OrderTypeListResponse>>(
      STATISTICS_PATH.ORDER_TYPES,
      {params: {truckId, fromDate, toDate}}
    );

    return res.data.data ?? []
  }
}