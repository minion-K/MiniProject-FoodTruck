import type { PaymentMethod } from "@/types/payment/payment.type";

export function getPaymentMethod(method: PaymentMethod) {
  switch (method) {
    case "TOSS_PAY":
      return "간편 결제";
    case "MOCK":
      return "현장 결제";
    default:
      return method;
  }
}
