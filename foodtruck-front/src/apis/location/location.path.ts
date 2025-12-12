import { BASE } from "../common/base.path";

const LOCATION_PREFIX = `${BASE}/locations`;

export const LOCATION_PATH = {
  ROOT: LOCATION_PREFIX,

  CREATE: LOCATION_PREFIX,
  LIST: LOCATION_PREFIX,

  ORDERBYID: (locationId: number) => `${LOCATION_PREFIX}/${locationId}`,
  UPDATE: (locationId: number) => `${LOCATION_PREFIX}/${locationId}`,
  DELETE: (locationId: number) => `${LOCATION_PREFIX}/${locationId}`
}