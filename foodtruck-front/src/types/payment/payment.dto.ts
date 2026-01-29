import type { PaymentMethod, PaymentStatus } from "./payment.type";

export interface PaymentApproveRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  productCode?: string;
  productName?: string;
}

export interface PaymentCreateRequest {
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
  orderId: string;
  paymentKey: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  productCode: string;
  productName: string;
  requestedAt: string;
  approvedAt: string | null;
}

export type PaymentResponseList = PaymentResponse[];
