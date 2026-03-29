import type { RoleType } from "@/types/role/role.type";

export function getRoleInfo(role: RoleType) {
  switch (role) {
    case "ADMIN":
      return {label: "관리자", color: "#fde2e2"};
    case "OWNER":
      return {label: "트럭 운영자", color: "#e2f0fd"};
    case "USER":
      return {label: "일반 회원", color: "#f3f4f6"};
    default:
      return role;
  }
}

export function getRoleLabels(roles: RoleType[]): string {
  return roles.map((role) => getRoleInfo(role).label).join(", ");
}