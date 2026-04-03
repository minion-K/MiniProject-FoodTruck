import type { ApiResponse } from "@/types/common/ApiResponse"
import type { AdminConversionFunnelResponse, AdminDashboardResponse, AdminGrowthTrendListResponse, AdminInsightListResponse, AdminPaymentStatusListResponse, AdminTopMenuListResponse, AdminTopTruckListResponse } from "@/types/statistics/statistics.dto"
import { privateApi } from "../common/axiosInstance"
import { ADMIN_STATISTICS_PATH } from "./statistics.path"

export const adminStatisticsApi = {
  getDashboard: async (params: {
    region?: string
    fromDate: string,
    toDate: string
  }): Promise<AdminDashboardResponse> => {
    const res = await privateApi.get<ApiResponse<AdminDashboardResponse>>(
      ADMIN_STATISTICS_PATH.DASHBOARD,
      {params}
    );

    return res.data.data;
  },

  getGrowthTrend: async (params: {
    region?: string
    fromDate: string,
    toDate: string
  }): Promise<AdminGrowthTrendListResponse> => {
    const res = await privateApi.get<ApiResponse<AdminGrowthTrendListResponse>>(
      ADMIN_STATISTICS_PATH.GROWTH_TREND,
      {params}
    );

    return res.data.data ?? [];
  },

  getConversionFunnel: async (params: {
    region?: string
    fromDate: string,
    toDate: string
  }): Promise<AdminConversionFunnelResponse> => {
    const res = await privateApi.get<ApiResponse<AdminConversionFunnelResponse>>(
      ADMIN_STATISTICS_PATH.CONVERSION_FUNNEL,
      {params}
    );

    return res.data.data;
  },

  getPaymentStatus: async (params: {
    region?: string
    fromDate: string,
    toDate: string
  }): Promise<AdminPaymentStatusListResponse> => {
    const res = await privateApi.get<ApiResponse<AdminPaymentStatusListResponse>>(
      ADMIN_STATISTICS_PATH.PAYMENT_STATUS,
      {params}
    );

    return res.data.data ?? [];
  },

  getTopTrucks: async (params: {
    region?: string
    fromDate: string,
    toDate: string
  }): Promise<AdminTopTruckListResponse> => {
    const res = await privateApi.get<ApiResponse<AdminTopTruckListResponse>>(
      ADMIN_STATISTICS_PATH.TOP_TRUCKS,
      {params}
    );

    return res.data.data ?? [];
  },

  getTopMenus: async (params: {
    region?: string
    fromDate: string,
    toDate: string
  }): Promise<AdminTopMenuListResponse> => {
    const res = await privateApi.get<ApiResponse<AdminTopMenuListResponse>>(
      ADMIN_STATISTICS_PATH.TOP_MENUS,
      {params}
    );

    return res.data.data;
  },

  getInsights: async (params: {
    region?: string
    fromDate: string,
    toDate: string
  }): Promise<AdminInsightListResponse> => {
    const res = await privateApi.get<ApiResponse<AdminInsightListResponse>>(
      ADMIN_STATISTICS_PATH.INSIGHTS,
      {params}
    );

    return res.data.data;
  },
}