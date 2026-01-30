import type { PaymentMethod } from "@/types/payment/payment.type";
import React, { createContext, useContext } from "react";

export interface PaymentMenuSummary {
  name: string;
  quantity: number;
}

export interface PaymentDisplayInfo {
  pickupTime?: string;
  menus?: PaymentMenuSummary[];
}

export interface PaymentContextValue {
  targetId: number;
  targetType: "RESERVATION" | "ONSITE";
  amount: number;
  productCode: string;
  productName: string;

  displayInfo?: PaymentDisplayInfo;

  method: PaymentMethod;
  setMethod: (method: PaymentMethod) => void;
}

export const PaymentContext = createContext<PaymentContextValue | null>(null);

export const usePaymentContext = () => {
  const context = useContext(PaymentContext);

  if (!context) {
    throw new Error(
      "PaymentContext는 PaymentProvider 내부에서만 사용할 수 있습니다.",
    );
  }

  return context;
};
