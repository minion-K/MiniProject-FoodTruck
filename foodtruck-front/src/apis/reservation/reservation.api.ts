import { privateApi, publicApi } from "../common/axiosInstance";
import { RESERVATION_PATH } from "./reservation.path";
import type {
  ReservationCreateRequest,
  ReservationDetailResponse,
  ReservationListResponse,
} from "@/types/reservation/reservation.dto";
import type { ApiResponse } from "@/types/common/ApiResponse";

export const reservationApi = {
  createReservation: async (body: ReservationCreateRequest): Promise<ReservationDetailResponse> => {
    const res = await privateApi.post<ApiResponse<ReservationDetailResponse>>(
      RESERVATION_PATH.ROOT,
      body
    );

    return res.data.data;
  },

  getReservationList: async (): Promise<ReservationListResponse> => {
    const res = await publicApi.get<ApiResponse<ReservationListResponse>>(
      RESERVATION_PATH.ROOT
    );

    return res.data.data;
  },

  getReservationById: async (
    reservationId: number): Promise<ReservationDetailResponse> => {
    const res = await publicApi.get<ApiResponse<ReservationDetailResponse>>(
      RESERVATION_PATH.BY_ID(reservationId)
    );

    return res.data.data;
  },

  updateStatus: async (reservationId: number): Promise<ReservationDetailResponse> => {
    const res = await publicApi.patch<ApiResponse<ReservationDetailResponse>>(
      RESERVATION_PATH.STATUS(reservationId)
    );

    return res.data.data;
  },  
}
