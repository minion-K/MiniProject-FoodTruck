package org.example.foodtruckback.common.constants.statistics;

import org.example.foodtruckback.common.constants.ApiBase;

public class AdminStatisticsApi {
    private AdminStatisticsApi() {}

    public static final String ROOT = ApiBase.BASE + "/admin/statistics";

    public static final String DASHBOARD = "/dashboard";
    public static final String GROWTH_TREND = "/growth-trend";
    public static final String CONVERSION_FUNNEL = "/conversion-funnel";
    public static final String PAYMENT_STATUS = "/payment-status";
    public static final String ORDER_TYPES = "/order-types";
    public static final String TOP_TRUCKS = "/top-trucks";
    public static final String TOP_MENUS = "/top-menus";
    public static final String INSIGHTS = "/insights";
}
