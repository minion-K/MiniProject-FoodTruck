import type { RoleType } from "./role.type";

export interface RoleCreateRequest {
  roleName: RoleType;
}

export interface RoleNameResponse {
  roleName: RoleType;
}

export type RoleListResponse = RoleNameResponse[];


export interface RoleCreateResponse {
  roleName: RoleType;
}
