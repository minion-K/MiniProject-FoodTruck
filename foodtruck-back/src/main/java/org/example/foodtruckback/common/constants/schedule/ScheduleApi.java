package org.example.foodtruckback.common.constants.schedule;

import org.example.foodtruckback.common.constants.ApiBase;

public class ScheduleApi {
    private ScheduleApi() {}

    public static final String ROOT = ApiBase.BASE + "/schedules";

    public static final String BY_ID = "/{scheduleId}";
}
