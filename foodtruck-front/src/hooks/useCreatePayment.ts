import { paymentApi } from "@/apis/payment/payment.api";
import { PAYMENT_KEYS } from "@/query/payment.keys";
import type { PaymentCreateRequest } from "@/types/payment/payment.dto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation<PaymentResponse, Error, PaymentCreateRequest>({
    mutationFn: (body) => paymentApi.createPayment(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_KEYS.me });
    },
  });
}

export default useCreatePayment;
