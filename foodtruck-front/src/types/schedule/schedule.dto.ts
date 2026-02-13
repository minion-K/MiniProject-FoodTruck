import type { ScheduleStatus } from "./schedule.type";

export interface ScheduleCreateRequest {
  startTime: string;
  endTime: string;
  locationId: number;
  maxReservations?: number;
}

export interface ScheduleUpdateRequest {
  startTime?: string;
  endTime?: string;
  locationId: number;
  maxReservations?: number;
}

export interface ScheduleStatueUpdateRequest {
  status: ScheduleStatus
}


export interface ScheduleDetailResponse {
  id: number;
  truckId: number;
  locationId: number;
  locationName: string;
  latitude: number;
  longitude: number;
  startTime: string;
  endTime: string;
  status: ScheduleStatus;
  maxReservations: number;
  createdAt: string;
  updatedAt: string;
}

export interface TruckScheduleItemResponse {
  scheduleId: number;
  startTime: string;
  endTime: string;
  locationId: number;
  locationName?: string;
  latitude: number;
  longitude: number;
  status: ScheduleStatus;
  maxReservations: number;
}

export type TruckScheduleListResponse = TruckScheduleItemResponse[];
