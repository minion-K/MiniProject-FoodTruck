import type { ReservationStatus } from "./reservation.type";

export interface ReservationCreateRequest {
  scheduleId: number; // 방문할 스케줄 ID
  pickupTime: string; // ISO 문자열(YYYY-MM-DDTHH:mm:ss)
  totalAmount: number;
  note?: string;
}

export interface ReservationListItemResponse {
  id: number;
  scheduleId: number;
  userId: number;
  pickupTime: string;
  totalAmount: number;
  status: ReservationStatus;
  note?: string;
}

export type ReservationListResponse = ReservationListItemResponse[];

export interface ReservationDetailResponse {
  id: number;
  scheduleId: number;
  userId: number;
  pickupTime: string;
  totalAmount: number;
  status: ReservationStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
}
