import type {
  AdminOrderListResponse,
  OrderCreateReqeust,
  OrderDetailResponse,
  OrderUpdateReqeust,
  OwnerOrderListResponse,
  UserOrderListResponse,
} from "@/types/order/order.dto";
import { privateApi } from "../common/axiosInstance";
import type { ApiResponse } from "@/types/common/ApiResponse";
import { ORDER_PATH } from "./order.path";

export const orderApi = {
  // 주문 생성
  createOrder: async (request: OrderCreateReqeust): Promise<OrderDetailResponse> => {
    const res = await privateApi.post<ApiResponse<OrderDetailResponse>>(
      ORDER_PATH.ROOT,
      request
    );

    return res.data.data;
  },

  // 주문 목록 조회
  getMyOrderList: async (): Promise<UserOrderListResponse[]> => {
    const res = await privateApi.get<ApiResponse<UserOrderListResponse[]>>(
      ORDER_PATH.ME()
    );

    return res.data.data;
  },

  getTruckOrderList: async (
    truckId: number
  ): Promise<OwnerOrderListResponse[]> => {
    const res = await privateApi.get<ApiResponse<OwnerOrderListResponse[]>>(
      ORDER_PATH.TRUCK(truckId)
    );

    return res.data.data;
  },

  getAdminOrderList: async (): Promise<AdminOrderListResponse[]> => {
    const res = await privateApi.get<ApiResponse<AdminOrderListResponse[]>>(
      ORDER_PATH.ADMIN
    );

    return res.data.data;
  },

  // 주문 상세 조회
  getOrderById: async (
    orderId: number
  ): Promise<OrderDetailResponse> => {
    const res = await privateApi.get<ApiResponse<OrderDetailResponse>>(
      ORDER_PATH.BY_ID(orderId)
    );

    return res.data.data;
  },

  // 주문 수정
  updateOrder: async (
    orderId: number,
    request: OrderUpdateReqeust
  ): Promise<OrderDetailResponse> => {
    const res = await privateApi.put<ApiResponse<OrderDetailResponse>>(
      ORDER_PATH.BY_ID(orderId),
      request
    );
    return res.data.data;
  },

  // 주문 취소
  cancelOrder: async (orderId: number): Promise<void> => {
    const res = await privateApi.put<ApiResponse<void>>(
      ORDER_PATH.CANCEL(orderId)
    );

    return res.data.data;
  },

  // 환불
  refundOrder: async (orderId: number): Promise<void> => {
    const res = await privateApi.put<ApiResponse<void>>(
      ORDER_PATH.REFUND(orderId)
    );

    return res.data.data;
  },
};
