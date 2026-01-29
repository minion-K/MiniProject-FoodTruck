import type { ApiResponse } from "@/types/common/ApiResponse";
import { privateApi, publicApi } from "../common/axiosInstance";
import { PAYMENT_PATH } from "./payment.path";
import type {
  PaymentApproveRequest,
  PaymentCreateRequest,
  PaymentRefundRequest,
  PaymentResponseList,
} from "@/types/payment/payment.dto";
import type { PaymentMethod } from "@/types/payment/payment.type";

export const paymentApi = {
  createPayment: async (
    req: PaymentCreateRequest,
  ): Promise<PaymentResponse> => {
    const res = await privateApi.post<ApiResponse<PaymentResponse>>(
      PAYMENT_PATH.ROOT,
      req,
    );

    return res.data.data;
  },

  approvePayment: async (
    req: PaymentApproveRequest,
  ): Promise<PaymentResponse> => {
    const res = await privateApi.post<ApiResponse<PaymentResponse>>(
      PAYMENT_PATH.APPROVE,
      req,
    );

    return res.data.data;
  },

  refundPayment: async (
    paymentId: number,
    req: PaymentRefundRequest,
  ): Promise<void> => {
    const res = await privateApi.post<ApiResponse<void>>(
      PAYMENT_PATH.REFUND(paymentId),
      req,
    );

    return res.data.data;
  },

  getMyPayments: async (): Promise<PaymentResponseList> => {
    const res = await privateApi.get<ApiResponse<PaymentResponseList>>(
      PAYMENT_PATH.ME,
    );

    return res.data.data ?? [];
  },

  getPaymentMethods: async () => {
    const res = await privateApi.get<ApiResponse<PaymentMethod[]>>(
      PAYMENT_PATH.METHOD,
    );

    return res.data.data;
  },
};
