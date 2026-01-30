import type { ReservationStatus } from "@/types/reservation/reservation.type";

export function getReservationStatus(status?: ReservationStatus | null) {
  switch (status) {
    case "PENDING":
      return { label: "예약완료", color: "#fff3cd" };
    case "CONFIRMED":
      return { label: "주문완료", color: "#d1e7dd" };
    case "CANCELED":
      return { label: "예약취소", color: "#f8d7da" };
    default:
      return { label: status, color: "#eee" };
  }
}
