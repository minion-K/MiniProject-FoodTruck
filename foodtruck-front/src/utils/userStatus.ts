import type { UserStatus } from "@/types/user/user.type";

export function getUserStatus(status: UserStatus) {
  switch (status) {
    case "ACTIVE":
      return { label: "활성", color: "#d1e7dd" };
    case "TEMP":
      return { label: "정지", color: "#f8d7da" };
    default:
      return { label: "활성", color: "#d1e7dd" };
  }
}