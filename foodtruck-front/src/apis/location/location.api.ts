import type { ApiResponse } from "@/types/common/ApiResponse"
import { privateApi, publicApi } from "../common/axiosInstance"
import type { LocationDetailResponse, LocationListResponse } from "@/types/location/location.dto"
import { LOCATION_PATH } from "./location.path"

export const locationApi = {
  createLocation: async (): Promise<LocationDetailResponse> => {
    const res = await privateApi.post<ApiResponse<LocationDetailResponse>> (
      LOCATION_PATH.CREATE
    );

    return res.data.data;
  },

  getLocationList: async (): Promise<LocationListResponse> => {
    const res = await publicApi.get<ApiResponse<LocationListResponse>> (
      LOCATION_PATH.LIST
    );

    return res.data.data;
  },

  getLocationById: async (locationId: number): Promise<LocationDetailResponse> => {
    const res = await publicApi.get<ApiResponse<LocationDetailResponse>> (
      LOCATION_PATH.ORDERBYID(locationId)
    );

    return res.data.data
  },

  updateLocation: async (locationId: number): Promise<LocationDetailResponse> => {
    const res = await privateApi.put<ApiResponse<LocationDetailResponse>> (
      LOCATION_PATH.UPDATE(locationId)
    );

    return res.data.data;
  },

  deleteLocation: async (locationId: number): Promise<void> => {
    const res = await privateApi.delete<ApiResponse<void>> (
      LOCATION_PATH.DELETE(locationId)
    );

    if(!res.data.success) throw new Error("스팟 제거 실패");
  }
}