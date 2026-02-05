import type { PaymentStatus } from "@/types/payment/payment.type";

export function getPaymentStatus(status?: PaymentStatus | null) {
  if (!status) return { label: "결제대기", color: "#fff3cd" };

  switch (status.toUpperCase()) {
    case "READY":
      return { label: "결제대기", color: "#fff3cd" };
    case "SUCCESS":
      return { label: "결제완료", color: "#d1e7dd" };
    case "FAILED":
      return { label: "결제실패", color: "#f8d7da" };
    case "CANCELLED":
      return { label: "결제취소", color: "#eee" };
    case "REFUNDED":
      return { label: "환불완료", color: "#e2e3ff" };
    default:
      return { label: "결제대기", color: "#fff3cd" };
  }
}
