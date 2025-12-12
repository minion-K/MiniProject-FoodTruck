import { publicApi } from "../common/axiosInstance";
import { RESERVATION_PATH } from "./reservation.path";
import type {
  ReservationCreateRequest,
  ReservationDetailResponse,
  ReservationListResponse,
} from "@/types/reservation/reservation.dto";
import type { ApiResponse } from "@/types/common/ApiResponse";

export const reservationApi = {
  createReservation: async (body: ReservationCreateRequest): Promise<ReservationDetailResponse> => {
    const res = await publicApi.post<ApiResponse<ReservationDetailResponse>>(
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

  cancelReservation: async (reservationId: number): Promise<ReservationDetailResponse> => {
    const res = await publicApi.patch<ApiResponse<ReservationDetailResponse>>(
      RESERVATION_PATH.CANCEL(reservationId)
    );

    return res.data.data;
  },

  confirmReservation: async (reservationId: number): Promise<ReservationDetailResponse> => {
    const res = await publicApi.patch<ApiResponse<ReservationDetailResponse>>(
      RESERVATION_PATH.CONFIRM(reservationId)
    );

    return res.data.data;
  },

  noShowReservation: async (reservationId: number): Promise<ReservationDetailResponse> => {
    const res = await publicApi.patch<ApiResponse<ReservationDetailResponse>>(
      RESERVATION_PATH.NO_SHOW(reservationId)
    );
    
    return res.data.data;
  },
};
