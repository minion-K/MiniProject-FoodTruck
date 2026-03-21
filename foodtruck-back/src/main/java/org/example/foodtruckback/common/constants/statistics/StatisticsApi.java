package org.example.foodtruckback.common.constants.statistics;

import org.example.foodtruckback.common.constants.ApiBase;

public class StatisticsApi {
    private StatisticsApi() {}

    public static final String ROOT = ApiBase.BASE + "/owner/statistics";

    public static final String DASHBOARD = "/dashboard";
    public static final String WEEKLY_SALES = "/weekly-sales";
    public static final String TOP_MENUS = "/top-menus";
    public static final String SCHEDULES = "/schedules";
    public static final String SCHEDULE_DETAIL = SCHEDULES + "/{scheduleId}";
    public static final String REFUND = "/refund";
}
