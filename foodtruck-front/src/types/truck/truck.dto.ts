import type { MenuCreateRequest } from "../menu/menu.dto";
import type { ScheduleCreateRequest, TruckScheduleItemResponse } from "../schedule/schedule.dto";
import type { TruckStatus } from "./truck.type";

export interface TruckCreateRequest {
  name: string;
  cuisine: string;

  menuItems?: MenuCreateRequest[];
  schedules?: ScheduleCreateRequest[];
}

export interface TruckUpdateRequest {
  name?: string;
  cuisine: string;
  status?: TruckStatus;
}

export interface TruckListItemResponse {
  id: number;
  name: string;
  cuisine: string;
  status: TruckStatus;
  locationSummary: string;
  latitude: number | null;
  longitude: number | null;
}

export type TruckListResponse = TruckListItemResponse[];


export interface TruckMenuItemResponse {
  id: number;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  isSoldOut: boolean;
}

export type TruckMenuListResponse = TruckMenuItemResponse[];

export interface TruckDetailResponse {
  id: number;
  ownerId: number;
  name: string;
  cuisine: string;
  status: TruckStatus;
  createdAt: string;
  updatedAt: string;

  menu: TruckMenuItemResponse[];
  schedules: TruckScheduleItemResponse[];
}