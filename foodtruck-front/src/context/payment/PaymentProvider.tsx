import React, { useState } from "react";
import { PaymentContext } from "./PaymentContext";
import type { PaymentMethod } from "@/types/payment/payment.type";

interface Props {
  value: {
    targetId: number;
    targetType: "RESERVATION" | "ONSITE";
    amount: number;
    productCode: string;
    productName: string;

    onsiteType?: "CARD" | "CASH";

    displayInfo?: {
      menus?: {name: string, quantity: number}[];
      pickupTime?: string;
    };

    selectedTruckId?: number | null;
    selectedScheduleId?: number | null;
  };

  children: React.ReactNode;
}

function PaymentProvider({ value, children }: Props) {
  const [method, setMethod] = useState<PaymentMethod>("TOSS_PAY");

  return (
    <PaymentContext.Provider
      value={{
        ...value,
        method,
        setMethod,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export default PaymentProvider;
