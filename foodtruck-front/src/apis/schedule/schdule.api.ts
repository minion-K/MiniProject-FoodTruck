import type {
  ScheduleCreateRequest,
  ScheduleDetailResponse,
  ScheduleUpdateRequest,
  TruckScheduleItemResponse,
  TruckScheduleListResponse,
} from "@/types/schedule/schedule.dto";
import { privateApi } from "../common/axiosInstance";
import type { ApiResponse } from "@/types/common/ApiResponse";
import { SCHEDULE_PATH } from "./schedule.path";

export const scheduleApi = {
  createSchedule: async (
    truckId: number,
    request: ScheduleCreateRequest,
  ): Promise<ScheduleDetailResponse> => {
    const res = await privateApi.post<ApiResponse<ScheduleDetailResponse>>(
      SCHEDULE_PATH.TRUCK_SCHEDULE(truckId),
      request,
    );

    return res.data.data;
  },

  getTruckSchedule: async (
    truckId: number,
  ): Promise<TruckScheduleListResponse> => {
    const res = await privateApi.get<ApiResponse<TruckScheduleListResponse>>(
      SCHEDULE_PATH.TRUCK_SCHEDULE(truckId),
    );

    return res.data.data;
  },

  getScheduleById: async (
    scheduleId: number,
  ): Promise<ScheduleDetailResponse> => {
    const res = await privateApi.get<ApiResponse<ScheduleDetailResponse>>(
      SCHEDULE_PATH.BY_ID(scheduleId),
    );

    return res.data.data;
  },

  updateSchedule: async (
    scheduleId: number,
    request: ScheduleUpdateRequest,
  ): Promise<ScheduleDetailResponse> => {
    const res = await privateApi.put<ApiResponse<ScheduleDetailResponse>>(
      SCHEDULE_PATH.BY_ID(scheduleId),
      request,
    );

    return res.data.data;
  },

  deleteSchedule: async (scheduleId: number): Promise<void> => {
    const res = await privateApi.delete<ApiResponse<void>>(
      SCHEDULE_PATH.BY_ID(scheduleId),
    );

    return res.data.data;
  },
};
