import { BASE } from "../common/base.path";

const TRUCK_PREFIX = `${BASE}/trucks`;

export const TRUCK_PATH = {
  ROOT: TRUCK_PREFIX,

  LIST: TRUCK_PREFIX,
  CREATE: TRUCK_PREFIX,
  BY_ID: (truckId: number) => `${TRUCK_PREFIX}/${truckId}`,
  OWNER: `${TRUCK_PREFIX}/owner`,
  UPDATE: (truckId: number) => `${TRUCK_PREFIX}/${truckId}`,
  DELETE: (truckId: number) => `${TRUCK_PREFIX}/${truckId}`,

  TRUCK_MENU: (truckId: number) => `${TRUCK_PREFIX}/${truckId}/menu`,
  SCHEDULE_ROOT: (truckId: number) => `${TRUCK_PREFIX}/${truckId}/schedules`,
  SCHEDULE_BY_ID: (truckId: number, scheduleId: number) =>
    `${TRUCK_PREFIX}/${truckId}/schedules/${scheduleId}`,
  SCHEDULE_UPDATE: (truckId: number, scheduleId: number) =>
    `${TRUCK_PREFIX}/${truckId}/schedules/${scheduleId}`,
  SCHEDULE_DELETE: (truckId: number, scheduleId: number) =>
    `${TRUCK_PREFIX}/${truckId}/schedules/${scheduleId}`,
};
