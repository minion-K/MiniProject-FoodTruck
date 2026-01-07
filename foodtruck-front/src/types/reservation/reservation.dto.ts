import type { TruckScheduleItemResponse } from "../schedule/schedule.dto";
import type { ReservationStatus } from "./reservation.type";

export interface ReservationMenuItemRequest {
  menuItemId: number;
  quantity: number;
}

export interface ReservationCreateRequest {
  scheduleId: number; 
  pickupTime: string; 
  menuItems: ReservationMenuItemRequest[];
  note?: string;
}

export interface ReservationListItemResponse {
  id: number;
  pickupTime: string;
  totalAmount: number;
  status: ReservationStatus;
  truckName: string;
  locationName: string;
}

export type ReservationListResponse = ReservationListItemResponse[];

export interface ReservationMenuItemResponse {
  menuItemId: number;
  quantity: number;
  name: string;
  price: number;
}

export interface ReservationDetailResponse {
  id: number;
  schedule?: TruckScheduleItemResponse;
  scheduleId: number
  username: string;
  pickupTime: string;
  totalAmount: number;
  status: ReservationStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
  truckName: string;
  locationName: string;
  latitude: number;
  longitude: number;
  menuItems: ReservationMenuItemResponse[];
}

export interface ReservationUpdateRequest {
  pickupTime: string;
  menuItems: ReservationMenuItemRequest[];
  note?: string;
}
