import type {
  TruckCreateRequest,
  TruckListResponse,
  TruckDetailResponse,
  TruckMenuListResponse,
  TruckUpdateRequest,
} from "@/types/truck/truck.dto";

import { publicApi } from "../common/axiosInstance";
import { TRUCK_PATH } from "./truck.path";
import type { ApiResponse } from "@/types/common/ApiResponse";

export const truckApi = {
  getTruckList: async (): Promise<TruckListResponse> => {
    const res = await publicApi.get<ApiResponse<TruckListResponse>>(
      TRUCK_PATH.LIST
    );

    return res.data.data;
  },

  createTruck: async (
    body: TruckCreateRequest
  ): Promise<TruckDetailResponse> => {
    const res = await publicApi.post<ApiResponse<TruckDetailResponse>>(
      TRUCK_PATH.CREATE,
      body
    );

    return res.data.data;
  },

  getTruckById: async (truckId: number): Promise<TruckDetailResponse> => {
    const res = await publicApi.get<ApiResponse<TruckDetailResponse>>(
      TRUCK_PATH.BY_ID(truckId)
    );

    return res.data.data;
  },

  getTruckMenu: async (truckId: number): Promise<TruckMenuListResponse> => {
    const res = await publicApi.get<ApiResponse<TruckMenuListResponse>>(
      TRUCK_PATH.TRUCK_MENU(truckId)
    );

    return res.data.data;
  },

  updateTruck: async (truckId: number, body: TruckUpdateRequest): Promise<TruckDetailResponse> => {
    const res = await publicApi.patch<ApiResponse<TruckDetailResponse>>(
      TRUCK_PATH.UPDATE(truckId),
      body
    );
    
    return res.data.data;
  },

  deleteTruck: async (truckId: number): Promise<void> => {
    await publicApi.delete<ApiResponse<void>>(
      TRUCK_PATH.DELETE(truckId));
  },

  getScheduleList: async (truckId: number) => {
    const res = await publicApi.get<ApiResponse<void>>(
      TRUCK_PATH.SCHEDULE_ROOT(truckId)
    );

    return res.data.data;
  },

  getScheduleById: async (truckId: number, scheduleId: number) => {
    const res = await publicApi.get<ApiResponse<void>>(
      TRUCK_PATH.SCHEDULE_BY_ID(truckId, scheduleId)
    );

    return res.data.data;
  },
};
