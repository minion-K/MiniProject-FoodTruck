package org.example.foodtruckback.common.constants.reservation;

import org.example.foodtruckback.common.constants.ApiBase;

public class ReservationApi {
    private ReservationApi() {}

    public static final String ROOT = ApiBase.BASE + "/reservations";

    public static final String BY_ID = "/{reservationId}";
    // 운영자 관리자 용
    public static final String STATUS = BY_ID + "/status";
    // 일반 사용자 용
    public static final String CANCEL = BY_ID + "/cancel";

    public static final String ME = "/me";
    public static final String OWNER = "/owner";
    public static final String ADMIN = "/admin";
}
