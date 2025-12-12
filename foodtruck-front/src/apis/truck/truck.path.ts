import { BASE } from "../common/base.path";

const TRUCK_FREFIX = `${BASE}/trucks`;

export const TRUCK_PATH = {
  ROOT: TRUCK_FREFIX,
  LIST: TRUCK_FREFIX,
  CREATE: TRUCK_FREFIX,

  BY_ID: (truckId: number) => `${TRUCK_FREFIX}/${truckId}`,
  UPDATE: (truckId: number) => `${TRUCK_FREFIX}/${truckId}`,
  DELETE: (truckId: number) => `${TRUCK_FREFIX}/${truckId}`,
  
  TRUCK_MENU: (truckId: number) => `${TRUCK_FREFIX}/${truckId}/menu`,
  SCHEDULE_ROOT: (truckId: number) => `${TRUCK_FREFIX}/${truckId}/schedules`,
  SCHEDULE_BY_ID: (truckId: number, scheduleId: number) =>`${TRUCK_FREFIX}/${truckId}/schedules/${scheduleId}`,
  SCHEDULE_UPDATE: (truckId: number, scheduleId: number) =>`${TRUCK_FREFIX}/${truckId}/schedules/${scheduleId}`,
  SCHEDULE_DELETE: (truckId: number, scheduleId: number) =>`${TRUCK_FREFIX}/${truckId}/schedules/${scheduleId}`,
}