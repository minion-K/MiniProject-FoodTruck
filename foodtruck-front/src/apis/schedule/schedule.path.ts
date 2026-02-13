import { BASE } from "../common/base.path";

const SCHEDULE_PREFIX = `${BASE}/schedules`;

export const SCHEDULE_PATH = {
  ROOT: SCHEDULE_PREFIX,
  BY_ID: (scheduleId: number) => `${SCHEDULE_PREFIX}/${scheduleId}`,
  STATUS: (schduleId: number) => `${SCHEDULE_PREFIX}/${schduleId}/status`,
  TRUCK_SCHEDULE: (truckId: number) => `${SCHEDULE_PREFIX}/trucks/${truckId}`,
};
