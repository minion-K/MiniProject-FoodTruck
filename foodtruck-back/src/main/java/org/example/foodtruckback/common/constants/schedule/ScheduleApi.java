package org.example.foodtruckback.common.constants.schedule;

import org.example.foodtruckback.common.constants.ApiBase;

public class ScheduleApi {
    private ScheduleApi() {}

    public static final String ROOT = ApiBase.BASE + "/schedules";

    public static final String BY_ID = "/{scheduleId}";
    public static final String STATUS = BY_ID + "/status";
    public static final String TRUCK_SCHEDULE = "/trucks/{truckId}";
}
