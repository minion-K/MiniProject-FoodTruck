import { BASE } from "../common/base.path";

const RESERVATION_PREFIX = `${BASE}/reservations`;

export const RESERVATION_PATH = {
  ROOT: RESERVATION_PREFIX,

  CREATE: RESERVATION_PREFIX,

  ME: () => `${RESERVATION_PREFIX}/me`,
  OWNER: () => `${RESERVATION_PREFIX}/owner`,
  ADMIN: () => `${RESERVATION_PREFIX}/admin`,
  BY_ID: (reservationId: number) => `${RESERVATION_PREFIX}/${reservationId}`,
  STATUS: (reservationId: number) => `${RESERVATION_PREFIX}/${reservationId}/status`,
  CANCEL: (reservationId: number) => `${RESERVATION_PREFIX}/${reservationId}/cancel`
}