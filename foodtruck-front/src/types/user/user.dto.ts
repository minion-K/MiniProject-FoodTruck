export interface UserDetailResponse {
  name: string;
  loginId: string;
  email: string;
  phone: string;
}

export interface UserListItemResponse {
  userId: number;
  name: string;
  email: string;
}

export type UserListResponse = UserListItemResponse[];

export interface UserUpdateRequest {
  name: string;
  loginId: string;
  email: string;
  phone: string;
}

export interface UserUpdateResponse {
  name: string;
  loginId: string;
  email: string;
  phone: string;
}
