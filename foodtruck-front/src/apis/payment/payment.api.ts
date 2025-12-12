import type { ApiResponse } from "@/types/common/ApiResponse";
import { privateApi, publicApi } from "../common/axiosInstance";
import { PAYMENT_PATH } from "./payment.path";
import type {
  PaymentApproveRequest,
  PaymentApproveResponse,
  PaymentCaptureResponse,
} from "@/types/payment/payment.dto";

export const paymentApi = {
  approvePayment: async (
    request: PaymentApproveRequest
  ): Promise<PaymentApproveResponse> => {
    const res = await privateApi.post<ApiResponse<PaymentApproveResponse>> (
      PAYMENT_PATH.APPROVE,
      request
    );

    try {
      return res.data.data;
    } catch (e) {
      throw new Error("결제 승인 처리 중 오류 발생");
    }
  },

  capturePayment: async (orderId: number): Promise<PaymentCaptureResponse> => {
    const res = await privateApi.post<ApiResponse<PaymentCaptureResponse>> (
      PAYMENT_PATH.CAPTURE(orderId)
    );

    try {
      return res.data.data;
    } catch (e) {
      throw new Error("결제 진행 중 오류");
    }
  },
};
