export interface MenuCreateRequest {
  truckId: number;     // 어떤 트럭의 메뉴인지
  name: string;
  price: number;
  optionText?: string;
}
export interface MenuUpdateRequest {
  name?: string;
  price?: number;
  optionText?: string;
}


export interface MenuDetailResponse {
  id: number;
  truckId: number;
  name: string;
  price: number;
  isSoldOut: boolean;
  optionText?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuListItemResponse {
  id: number;
  name: string;
  price: number;
  isSoldOut: boolean;
  optionText?: string;
}


export type MenuListResponse = MenuListItemResponse[];