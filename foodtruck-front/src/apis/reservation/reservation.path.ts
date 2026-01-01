import { BASE } from "../common/base.path";

const RESERVATION_FREFIX = `${BASE}/reservations`;

export const RESERVATION_PATH = {
  ROOT: RESERVATION_FREFIX,

  LIST: RESERVATION_FREFIX,
  CREATE: RESERVATION_FREFIX,

  BY_ID: (reservationId: number) => `${RESERVATION_FREFIX}/${reservationId}`,
  STATUS: (reservationId: number) => `${RESERVATION_FREFIX}/${reservationId}/status`,
}