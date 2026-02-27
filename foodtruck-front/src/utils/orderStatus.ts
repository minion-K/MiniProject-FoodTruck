import type { OrderStatus } from "@/types/order/order.type";

export function getOrderStatus(status?: OrderStatus | null) {
  if(!status) {
    return {label: "주문대기", color: "#fff3dc"}
  }

  switch (status.toUpperCase()) {
    case "PENDING":
      return {label: "주문완료", color: "#fff3dc"};

    case "PAID":
      return {label: "결제완료", color: "#d1e7dd"};

    case "FAILED":
      return {label: "결제실패", color: "#f8d7da"};

    case "CANCELED":
      return {label: "주문취소", color: "#eee"};

    case "REFUNDED":
      return {label: "환불완료", color: "#e2e3ff"};
    
    default:
      return {label: "주문대기", color: "#fff3cd"}
  }
}