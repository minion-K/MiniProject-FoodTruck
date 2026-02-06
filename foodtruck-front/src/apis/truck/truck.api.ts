import type {
  TruckCreateRequest,
  TruckListResponse,
  TruckDetailResponse,
  TruckMenuListResponse,
  TruckUpdateRequest,
} from "@/types/truck/truck.dto";

import { privateApi, publicApi } from "../common/axiosInstance";
import { TRUCK_PATH } from "./truck.path";
import type { ApiResponse } from "@/types/common/ApiResponse";

export const truckApi = {
  createTruck: async (
    body: TruckCreateRequest,
  ): Promise<TruckDetailResponse> => {
    const res = await privateApi.post<ApiResponse<TruckDetailResponse>>(
      TRUCK_PATH.CREATE,
      body,
    );

    return res.data.data;
  },

  getTruckList: async (): Promise<TruckListResponse> => {
    const res = await publicApi.get<ApiResponse<TruckListResponse>>(
      TRUCK_PATH.LIST,
    );

    return res.data.data;
  },

  getTruckById: async (truckId: number): Promise<TruckDetailResponse> => {
    const res = await publicApi.get<ApiResponse<TruckDetailResponse>>(
      TRUCK_PATH.BY_ID(truckId),
    );

    return res.data.data;
  },

  getOwnerTruckList: async (): Promise<TruckListResponse> => {
    const res = await privateApi.get<ApiResponse<TruckListResponse>>(
      TRUCK_PATH.OWNER,
    );

    return res.data.data;
  },

  updateTruck: async (
    truckId: number,
    body: TruckUpdateRequest,
  ): Promise<TruckDetailResponse> => {
    const res = await privateApi.patch<ApiResponse<TruckDetailResponse>>(
      TRUCK_PATH.UPDATE(truckId),
      body,
    );

    return res.data.data;
  },

  deleteTruck: async (truckId: number): Promise<void> => {
    await privateApi.delete<ApiResponse<void>>(TRUCK_PATH.DELETE(truckId));
  },
};
