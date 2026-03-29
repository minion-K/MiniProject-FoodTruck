import type {
  TruckCreateRequest,
  TruckListResponse,
  TruckDetailResponse,
  TruckUpdateRequest,
  TruckStatusUpdateRequest,
  TruckListItemResponse,
} from "@/types/truck/truck.dto";

import { privateApi, publicApi } from "../common/axiosInstance";
import { TRUCK_PATH } from "./truck.path";
import type { ApiResponse } from "@/types/common/ApiResponse";
import type { TruckStatus } from "@/types/truck/truck.type";

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

  getTruckList: async (params?:{
    page: number,
    size: number,
    keyword?: string,
    status?: TruckStatus
  }
  ): Promise<TruckListResponse> => {
    const res = await publicApi.get<ApiResponse<TruckListResponse>>(
      TRUCK_PATH.LIST, {params}
    );

    return res.data.data;
  },

  getTruckById: async (truckId: number): Promise<TruckDetailResponse> => {
    const res = await publicApi.get<ApiResponse<TruckDetailResponse>>(
      TRUCK_PATH.BY_ID(truckId),
    );

    return res.data.data;
  },

  getOwnerTruckList: async (): Promise<TruckListItemResponse[]> => {
    const res = await privateApi.get<ApiResponse<TruckListItemResponse[]>>(
      TRUCK_PATH.OWNER,
    );

    return res.data.data;
  },

  updateTruck: async (
    truckId: number,
    request: TruckUpdateRequest,
  ): Promise<TruckDetailResponse> => {
    const res = await privateApi.put<ApiResponse<TruckDetailResponse>>(
      TRUCK_PATH.UPDATE(truckId),
      request,
    );

    return res.data.data;
  },

  updateTruckStatus: async (
    truckId: number, 
    request: TruckStatusUpdateRequest
  ): Promise<void> => {
    const res = await privateApi.put<ApiResponse<void>>(
      TRUCK_PATH.STATUSUPDATE(truckId),
      request
    )

    return res.data.data;
  },

  deleteTruck: async (truckId: number): Promise<void> => {
    const res = await privateApi.delete<ApiResponse<void>>(
      TRUCK_PATH.DELETE(truckId)
    )

    return res.data.data;
  },
};
