import type { PaymentMethod } from "@/types/payment/payment.type";
import React, { createContext, useContext } from "react";

export interface PaymentContextValue {
  targetId: number;
  targetType: "RESERVATION" | "ONSITE";
  amount: number;
  productCode: string;
  productName: string;

  method: PaymentMethod;
  setMethod: (Method: PaymentMethod) => void;
}

export const PaymentContext = createContext<PaymentContextValue | null>(null);

export const usePaymentContext = () => {
  const context = useContext(PaymentContext);

  if (!context) {
    throw new Error("PaymentContext must be used within PaymentProvider");
  }

  return context;
};
