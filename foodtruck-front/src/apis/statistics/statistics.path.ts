import { BASE } from "../common/base.path";

const STATISTICS_PREFIX = `${BASE}/owner/statistics`;

export const STATISTICS_PATH = {
  ROOT: STATISTICS_PREFIX,

  DASHBOARD: `${STATISTICS_PREFIX}/dashboard`,
  WEEKLY_SALES: `${STATISTICS_PREFIX}/weekly-sales`,
  TOP_MENUS: `${STATISTICS_PREFIX}/top-menus`,
  SCHEDULES: `${STATISTICS_PREFIX}/schedules`,
  SCHEDULES_DETAIL: `${STATISTICS_PREFIX}/schedules/{scheduleId}`,
  REFUNDCOUNT: `${STATISTICS_PREFIX}/refund`
};