import { privateApi, publicApi } from "../common/axiosInstance";
import { RESERVATION_PATH } from "./reservation.path";
import type {
  AdminReservationListResponse,
  OwnerReservationListResponse,
  ReservationCreateRequest,
  ReservationDetailResponse,
  ReservationListResponse,
  ReservationStatusUpdateRequest,
  ReservationUpdateRequest,
} from "@/types/reservation/reservation.dto";
import type { ApiResponse } from "@/types/common/ApiResponse";

export const reservationApi = {
  createReservation: async (
    request: ReservationCreateRequest,
  ): Promise<ReservationDetailResponse> => {
    const res = await privateApi.post<ApiResponse<ReservationDetailResponse>>(
      RESERVATION_PATH.ROOT,
      request,
    );

    return res.data.data;
  },

  getMyReservations: async (): Promise<ReservationListResponse> => {
    const res = await privateApi.get<ApiResponse<ReservationListResponse>>(
      RESERVATION_PATH.ME(),
    );

    return res.data.data;
  },

  getOwnerReservations: async (
    scheduleId: number
  ): Promise<OwnerReservationListResponse> => {
    const res = await privateApi.get<ApiResponse<OwnerReservationListResponse>>(
      RESERVATION_PATH.OWNER(),
      {params: {scheduleId}}
    );

    return res.data.data;
  },

  getAdminReservations: async (
    scheduleId?: number
  ): Promise<AdminReservationListResponse> => {
    const res = await privateApi.get<ApiResponse<AdminReservationListResponse>>(
      RESERVATION_PATH.ADMIN(),
      {params: scheduleId ? {scheduleId} : {}}
    );

    return res.data.data;
  },

  getReservationById: async (
    reservationId: number,
  ): Promise<ReservationDetailResponse> => {
    const res = await privateApi.get<ApiResponse<ReservationDetailResponse>>(
      RESERVATION_PATH.BY_ID(reservationId),
    );

    return res.data.data;
  },

  updateStatus: async (
    reservationId: number,
    request: ReservationStatusUpdateRequest
  ): Promise<ReservationDetailResponse> => {
    const res = await privateApi.put<ApiResponse<ReservationDetailResponse>>(
      RESERVATION_PATH.STATUS(reservationId),
      request
    );

    return res.data.data;
  },

  updateReservation: async (
    reservationId: number,
    request: ReservationUpdateRequest,
  ): Promise<ReservationDetailResponse> => {
    const res = await privateApi.put<ApiResponse<ReservationDetailResponse>>(
      RESERVATION_PATH.BY_ID(reservationId),
      request,
    );

    return res.data.data;
  },

  cancelReservation: async (reservationId: number): Promise<void> => {
    const res = await privateApi.put<ApiResponse<void>>(
      RESERVATION_PATH.CANCEL(reservationId),
    );

    return res.data.data;
  },
};
