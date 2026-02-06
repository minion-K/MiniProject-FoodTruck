import type { TruckStatus } from "@/types/truck/truck.type";

export function getTruckStatus(status?: TruckStatus | null) {
  if (!status) return { label: "미정", color: "#eee" };

  switch (status.toUpperCase()) {
    case "ACTIVE":
      return { label: "운영 중", color: "#1a7f37" };
    case "INACTIVE":
      return { label: "마감", color: "#d32f2f" };
    default:
      return { label: "미정", color: "#eee" };
  }
}
