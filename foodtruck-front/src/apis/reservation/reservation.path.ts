import { BASE } from "../common/base.path";

const RESERVATION_FREFIX = `${BASE}/reservations`;

export const RESERVATION_PATH = {
  ROOT: RESERVATION_FREFIX,

  LIST: RESERVATION_FREFIX,
  CREATE: RESERVATION_FREFIX,

  BY_ID: (reservationId: number) => `${RESERVATION_FREFIX}/${reservationId}`,
  CANCEL: (reservationId: number) => `${RESERVATION_FREFIX}/${reservationId}/cancel`,
  CONFIRM: (reservationId: number) => `${RESERVATION_FREFIX}/${reservationId}/confirm`,
  NO_SHOW: (reservationId: number) =>`${RESERVATION_FREFIX}/${reservationId}/no-show`,
}