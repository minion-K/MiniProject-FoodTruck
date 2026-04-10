import type { PaymentMethod, PaymentStatus } from "./payment.type";

export interface PaymentApproveRequest {
  paymentKey: string;
  tossOrderId: string | null;
  orderId: number | null;
  amount: number;
  method: PaymentMethod;
  productCode?: string;
  productName?: string;
}

export interface PaymentCreateRequest {
  orderId: number;
  productCode: string;
  productName: string;
  amount: number;
  method: PaymentMethod;
}

export interface PaymentRefundRequest {
  amount: number;
  reason?: string;
}

export interface PaymentResponse {
  id: number;
  orderId: number;
  paymentOrderId: string;
  paymentKey: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  productCode: string;
  productName: string;
  requestedAt: string;
  approvedAt: string | null;
}

export interface PaymentResponseList {
  content: PaymentResponse[];
  totalPage: number;
  totalElement: number;
  number: number;
};
