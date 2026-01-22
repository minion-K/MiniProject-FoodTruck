import type { RoleType } from "@/types/role/role.type";

export function getRoleLabel(role: RoleType): string {
  switch (role) {
    case "ADMIN":
      return "관리자";
    case "OWNER":
      return "트럭 주인";
    case "USER":
      return "일반 회원";
    default:
      return role;
  }
}

export function getRoleLabels(roles: RoleType[]): string {
  return roles.map(getRoleLabel).join(", ");
}