import { BASE } from "../common/base.path";

const ORDER_PREFIX = `${BASE}/orders`;

export const ORDER_PATH = {
  ROOT: ORDER_PREFIX,

  CREATE: ORDER_PREFIX,
  LIST: ORDER_PREFIX,

  // 상세 조회 / 수정
  ORDERBYID: (orderId: number) => `${ORDER_PREFIX}/${orderId}`,
  UPDATE: (orderId: number) => `${ORDER_PREFIX}/${orderId}`,

  CANCEL: (orderId: number) => `${ORDER_PREFIX}/${orderId}/cancel`,
  REFUND: (orderId: number) => `${ORDER_PREFIX}/${orderId}/refund`,
}