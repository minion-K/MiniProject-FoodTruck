import type { OrderSource } from "@/types/order/order.type";

export function getOrderSource(source?: OrderSource | null) {
  if(!source) return {label: "현장주문", color: "#e5e7eb"};

  switch(source.toUpperCase()) {
    case "ONSITE":
      return {label: "현장주문", color: "#e5e7eb"};
    
    case "RESERVATION": 
      return {label: "예약주문", color: "#dbeafe"};
    
    default:
      return {label: "현장주문", color: "#e5e7eb"};
  }
}