import { paymentApi } from "@/apis/payment/payment.api";
import { PAYMENT_KEYS } from "@/query/payment.keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

interface RefundMutationPayload {
  paymentId: number;
  amount: number;
  reason?: string;
}

function useRefundPayment() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, RefundMutationPayload>({
    mutationFn: ({ paymentId, amount, reason }) =>
      paymentApi.refundPayment(paymentId, { amount, reason }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.me });
    },
  });
}

export default useRefundPayment;
