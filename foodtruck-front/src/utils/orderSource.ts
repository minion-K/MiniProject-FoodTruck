import type { OrderSource } from "@/types/order/order.type";

export function getOrderSource(source?: OrderSource | null) {
  if(!source) return "현장주문";

  switch(source.toUpperCase()) {
    case "ONSITE":
      return "현장주문";
    
    case "RESERVATION": 
      return "예약주문";
    
    default:
      return "현장주문";
  }
}