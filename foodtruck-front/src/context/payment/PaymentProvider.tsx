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
