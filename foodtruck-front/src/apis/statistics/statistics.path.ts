import { BASE } from "../common/base.path";

const STATISTICS_PREFIX = `${BASE}/owner/statistics`;

export const STATISTICS_PATH = {
  ROOT: STATISTICS_PREFIX,

  DASHBOARD: `${STATISTICS_PREFIX}/dashboard`,
  WEEKLY_SALES: `${STATISTICS_PREFIX}/weekly-sales`,
  TOP_MENUS: `${STATISTICS_PREFIX}/top-menus`,
  SCHEDULES: `${STATISTICS_PREFIX}/schedules`,
  SCHEDULES_DETAIL: (scheduleId: number) => `${STATISTICS_PREFIX}/schedules/${scheduleId}`,
  REFUNDCOUNT: `${STATISTICS_PREFIX}/refund`,
  ORDER_TYPES: `${STATISTICS_PREFIX}/order-types`
};

const ADMIN_STATISTICS_PREFIX = `${BASE}/admin/statistics`;

export const ADMIN_STATISTICS_PATH = {
  ROOT : ADMIN_STATISTICS_PREFIX,

  DASHBOARD: `${ADMIN_STATISTICS_PREFIX}/dashboard`,
  GROWTH_TREND: `${ADMIN_STATISTICS_PREFIX}/growth-trend`,
  CONVERSION_FUNNEL: `${ADMIN_STATISTICS_PREFIX}/conversion-funnel`,
  PAYMENT_STATUS: `${ADMIN_STATISTICS_PREFIX}/payment-status`,
  ORDER_TYPES: `${ADMIN_STATISTICS_PREFIX}/order-types`,
  TOP_TRUCKS: `${ADMIN_STATISTICS_PREFIX}/top-trucks`,
  TOP_MENUS: `${ADMIN_STATISTICS_PREFIX}/top-menus`,
  INSIGHTS: `${ADMIN_STATISTICS_PREFIX}/insights`
}