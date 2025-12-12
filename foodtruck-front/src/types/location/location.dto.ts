export interface LocationCreateRequest {
  name: string;
  address?: string | null;
  latitude: number;
  longitude: number;
}

export interface LocationUpdateRequest {
  name?: string;
  address?: string | null;
  latitude?: number;
  longitude?: number;
}

export interface LocationDetailResponse {
  id: number;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface LocationListItemResponse {
  id: number;
  name: string;
  address: string | null;
  createdAt: string;
}

export type LocationListResponse = LocationListItemResponse[];