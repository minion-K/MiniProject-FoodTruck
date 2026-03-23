import type { DashboardResponse, RefundResponse, ScheduleDetailResponse, ScheduleSalesResponseList, TopMenuResponseList, WeeklySalesResponseList,  } from "@/types/statistics/statistics.dto";
import { privateApi } from "../common/axiosInstance";
import { type ApiResponse } from "@/types/common/ApiResponse";
import { STATISTICS_PATH } from "./statistics.path";

export const statisticsApi = {
  getDashboard: async (truckId?: number): Promise<DashboardResponse> => {
    const res = await privateApi.get<ApiResponse<DashboardResponse>>(
      STATISTICS_PATH.DASHBOARD,
      {params: {truckId}}
    );

    return res.data.data;
  },

  getWeeklySales: async (truckId?: number): Promise<WeeklySalesResponseList> => {
    const res = await privateApi.get<ApiResponse<WeeklySalesResponseList>>(
      STATISTICS_PATH.WEEKLY_SALES,
      {params: {truckId}}
    );

    return res.data.data ?? [];
  },

  getTopMenus: async (truckId?: number): Promise<TopMenuResponseList> => {
    const res = await privateApi.get<ApiResponse<TopMenuResponseList>>(
      STATISTICS_PATH.TOP_MENUS,
      {params: {truckId}}
    );

    return res.data.data ?? [];
  },

  getSchedules: async (
    truckId?: number, 
    page: number = 0, 
    size: number = 10
  ): Promise<ScheduleSalesResponseList> => {
    const res = await privateApi.get<ApiResponse<ScheduleSalesResponseList>>(
      STATISTICS_PATH.SCHEDULES,
      {params: {truckId, page, size}}
    );

    return res.data.data ?? [];
  },

  getSchedulesDetail: async (): Promise<ScheduleDetailResponse> => {
    const res = await privateApi.get<ApiResponse<ScheduleDetailResponse>>(
      STATISTICS_PATH.SCHEDULES_DETAIL
    );

    return res.data.data;
  },

  getRefundCount: async (truckId?: number): Promise<RefundResponse> => {
    const res = await privateApi.get<ApiResponse<RefundResponse>>(
      STATISTICS_PATH.REFUNDCOUNT,
      {params: {truckId}}
    );

    return res.data.data;
  }
}