import type {
  OrderCreateRequest,
  OrderDetailResponse,
  OrderListResponse,
  OrderUpdateRequest,
} from "@/types/order/order.dto";
import { privateApi } from "../common/axiosInstance";
import type { ApiResponse } from "@/types/common/ApiResponse";
import { ORDER_PATH } from "./order.path";

export const orderApi = {
  // 주문 생성
  createOrder: async (request: OrderCreateRequest): Promise<OrderDetailResponse> => {
    const res = await privateApi.post<ApiResponse<OrderDetailResponse>>(
      ORDER_PATH.CREATE,
      request
    );

    return res.data.data;
  },

  // 주문 목록 조회
  getOrderList: async (): Promise<OrderListResponse> => {
    const res = await privateApi.get<ApiResponse<OrderListResponse>>(
      ORDER_PATH.LIST
    );

    return res.data.data;
  },

  // 주문 상세 조회
  getOrder: async (orderId: number): Promise<OrderDetailResponse> => {
    const res = await privateApi.get<ApiResponse<OrderDetailResponse>>(
      ORDER_PATH.ORDERBYID(orderId)
    );

    return res.data.data;
  },

  // 주문 수정
  updateOrder: async (
    orderId: number,
    request: OrderUpdateRequest
  ): Promise<OrderDetailResponse> => {
    const res = await privateApi.put<ApiResponse<OrderDetailResponse>>(
      ORDER_PATH.UPDATE(orderId),
      request
    );
    return res.data.data;
  },

  // 주문 취소
  cancelOrder: async (orderId: number): Promise<void> => {
    const res = await privateApi.put<ApiResponse<void>>(
      ORDER_PATH.CANCEL(orderId)
    );

    if (!res.data.success) throw new Error("주문 취소 실패");
  },

  // 환불
  refundOrder: async (orderId: number): Promise<void> => {
    const res = await privateApi.put<ApiResponse<void>>(
      ORDER_PATH.REFUND(orderId)
    );

    if (!res.data.success) throw new Error("환불 실패");
  },
};
