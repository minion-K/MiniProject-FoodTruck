import type { ScheduleStatus } from "@/types/schedule/schedule.type";

export function getScheduleStatus(status?: ScheduleStatus) {
  if(!status) return {label: "미정", color: "#eee"};

  switch (status.toUpperCase()) {
    case "PLANNED":
      return {label: "PLANNED", color: "#1976d2"};
    case "OPEN":
      return {label: "OPEN", color: "#1a7f37"};
    case "CLOSED": 
      return {label: "CLOSED", color: "#d32f2f"};
    case "CANCELED":
      return {label: "CANCELED", color: "#616161"};
    default:
      return {label: "미정", color: "#eee"};
  }
}