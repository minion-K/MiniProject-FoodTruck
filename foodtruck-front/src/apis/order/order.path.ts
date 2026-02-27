import { BASE } from "../common/base.path";

const ORDER_PREFIX = `${BASE}/orders`;

export const ORDER_PATH = {
  ROOT: ORDER_PREFIX,

  ME: () => `${ORDER_PREFIX}/me`,
  TRUCK: (truckId: number) => `${ORDER_PREFIX}/trucks/${truckId}`,
  ADMIN: ORDER_PREFIX,
  BY_ID: (orderId: number) => `${ORDER_PREFIX}/${orderId}`,
  CANCEL: (orderId: number) => `${ORDER_PREFIX}/${orderId}/cancel`,
  REFUND: (orderId: number) => `${ORDER_PREFIX}/${orderId}/refund`
}