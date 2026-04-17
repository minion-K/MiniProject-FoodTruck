import type { AuthProvider } from "../auth/auth.type";
import type { RoleType } from "../role/role.type";
import type { UserStatus } from "./user.type";

export interface AdminUserUpdateRequest {
  name?: string;
  email?: string;
  phone?: string | null;
}

export interface UserUpdateRequest {
  name?: string;
  phone?: string | null;
}

export interface UserDetailResponse {
  id: number;
  name: string;
  loginId: string;
  email: string;
  phone: string | null;
  roles: RoleType[];
  provider: AuthProvider;
  status: UserStatus;
}

export interface UserListItemResponse {
  id: number;
  name: string;
  loginId: string;
  email: string;
  phone: string | null;
  status: UserStatus;
  roles: RoleType[];
  createdAt: string;
}

export interface UserListResponse {
  content: UserListItemResponse[];
  totalPage: number;
  totalElement: number;
  number: number;
}

export interface UserStatusUpdateResponse {
  userId: number;
  status: string;
}

export interface UserCountResponse {
  total: number;
  user: number;
  owner: number;
  admin: number;
}