import type { TruckStatus } from "@/types/truck/truck.type";

export function getTruckStatus(status?: TruckStatus | null) {
  if (!status) return { label: "미정", bg: "#eee", color: "#555"};

  switch (status.toUpperCase()) {
    case "ACTIVE":
      return { label: "OPEN", bg: "#d1e7dd", color: "#0f5132" };
    case "INACTIVE":
      return { label: "CLOSE", bg: "#f8d7da", color: "#842029" };
    case "SUSPENDED":
      return {label: "운영정지", bg: "#e2e3ff", color: "#3730a3"}
    default:
      return { label: "미정", bg: "#eee", color: "#555"};
  }
}
