import { privateApi, publicApi } from "../common/axiosInstance";
import { RESERVATION_PATH } from "./reservation.path";
import type {
  ReservationCreateRequest,
  ReservationDetailResponse,
  ReservationListResponse,
  ReservationUpdateRequest,
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
    const res = await privateApi.get<ApiResponse<ReservationListResponse>>(
      RESERVATION_PATH.ROOT
    );

    return res.data.data;
  },

  getReservationById: async (
    reservationId: number): Promise<ReservationDetailResponse> => {
    const res = await privateApi.get<ApiResponse<ReservationDetailResponse>>(
      RESERVATION_PATH.BY_ID(reservationId)
    );

    return res.data.data;
  },

  updateStatus: async (reservationId: number): Promise<ReservationDetailResponse> => {
    const res = await privateApi.post<ApiResponse<ReservationDetailResponse>>(
      RESERVATION_PATH.STATUS(reservationId)
    );

    return res.data.data;
  },
  
  updateReservation: async (reservationId: number, request: ReservationUpdateRequest): Promise<ReservationDetailResponse> => {
    const res = await privateApi.put<ApiResponse<ReservationDetailResponse>>(
      RESERVATION_PATH.BY_ID(reservationId), request
    );

    return res.data.data;
  },

  cancelReservation: async(reservationId: number): Promise<void> => {
    const res = await privateApi.post<ApiResponse<void>>(
      RESERVATION_PATH.CANCEL(reservationId)
    );

    return res.data.data;
  }
}
