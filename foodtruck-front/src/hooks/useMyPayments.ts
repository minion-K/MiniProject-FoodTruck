import { paymentApi } from "@/apis/payment/payment.api";
import { PAYMENT_KEYS } from "@/query/payment.keys";
import type { PaymentResponseList } from "@/types/payment/payment.dto";
import { useQueries, useQuery } from "@tanstack/react-query";
import React from "react";

function useMyPayments() {
  return useQuery<PaymentResponseList>({
    queryKey: PAYMENT_KEYS.me,
    queryFn: () => paymentApi.getMyPayments(),
  });
}

export default useMyPayments;
