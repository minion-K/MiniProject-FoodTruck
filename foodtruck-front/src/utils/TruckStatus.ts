import type { TruckStatus } from "@/types/truck/truck.type";

export function getTruckStatus(status?: TruckStatus | null) {
  if (!status) return { label: "미정", color: "#eee" };

  switch (status.toUpperCase()) {
    case "ACTIVE":
      return { label: "OPEN", color: "#d1e7dd" };
    case "INACTIVE":
      return { label: "CLOSE", color: "#f8d7da" };
    case "SUSPENDED":
      return {label: "SUSPENDED", color: "#e2e3ff"}
    default:
      return { label: "미정", color: "#eee" };
  }
}
