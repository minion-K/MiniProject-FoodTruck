import { paymentApi } from "@/apis/payment/payment.api";
import { PaymentMethod } from "@/types/payment/payment.type";
import { useQuery } from "@tanstack/react-query";
import React from "react";

function usePaymentMethods() {
  return useQuery<PaymentMethod[]>({
    queryKey: ["paymentMethods"],
    queryFn: () => paymentApi.getPaymentMethods(),
  });
}

export default usePaymentMethods;
