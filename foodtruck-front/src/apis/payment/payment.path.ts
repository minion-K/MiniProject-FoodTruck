import { BASE } from "../common/base.path";

const PAYMENT_PREFIX = `${BASE}/payments`;

export const PAYMENT_PATH = {
  ROOT: PAYMENT_PREFIX,

  APPROVE: `${PAYMENT_PREFIX}/approve`,
  ME: `${PAYMENT_PREFIX}/me`,
  REFUND: (paymentId: number) => `${PAYMENT_PREFIX}/${paymentId}/refund`,
  METHOD: `${PAYMENT_PREFIX}/methods`,
};
