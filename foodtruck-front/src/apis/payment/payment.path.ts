import { BASE } from "../common/base.path";

const PAYMENT_PREFIX = `${BASE}/payments`;

export const PAYMENT_PATH = {
  ROOT: PAYMENT_PREFIX,
  
  APPROVE: PAYMENT_PREFIX,
  CAPTURE: (orderId: number) => `${PAYMENT_PREFIX}/${orderId}/capture`
  
}