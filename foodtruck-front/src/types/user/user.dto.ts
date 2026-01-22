import type { AuthProvider } from "../auth/auth.type";
import type { RoleType } from "../role/role.type";

export interface UserDetailResponse {
  id: number;
  name: string;
  loginId: string;
  email: string;
  phone: string | null;
  roles: RoleType[];
  provider: AuthProvider;
}

export interface UserListItemResponse {
  id: number;
  name: string;
  loginId: string;
  email: string;
}

export type UserListResponse = UserListItemResponse[];

export interface UserUpdateRequest {
  name?: string;
  phone?: string | null;
}

export interface AdminUserUpdateRequest {
  name?: string;
  email?: string;
  phone?: string | null;
}