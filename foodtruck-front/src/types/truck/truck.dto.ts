import type { MenuListItemResponse } from "../menu/menu.dto";
import type {
  TruckScheduleItemResponse,
} from "../schedule/schedule.dto";
import type { TruckStatus } from "./truck.type";

export interface TruckCreateRequest {
  name: string;
  cuisine?: string;
}

export interface TruckUpdateRequest {
  name: string;
  cuisine?: string;
}

export interface TruckStatusUpdateRequest {
  status: TruckStatus;
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

export interface TruckDetailResponse {
  id: number;
  ownerId: number;
  name: string;
  cuisine: string;
  status: TruckStatus;
  createdAt: string;
  updatedAt: string;

  menu: MenuListItemResponse[];
  schedules: TruckScheduleItemResponse[];
}
