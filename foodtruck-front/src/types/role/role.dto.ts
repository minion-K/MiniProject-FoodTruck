import type { RoleType } from "./role.type";

export interface RoleNameResponse {
  roleName: RoleType;
}

export type RoleListResponse = RoleNameResponse[];

export interface RoleCreateRequest {
  roleName: RoleType;
}

export interface RoleCreateResponse {
  roleName: RoleType;
}
