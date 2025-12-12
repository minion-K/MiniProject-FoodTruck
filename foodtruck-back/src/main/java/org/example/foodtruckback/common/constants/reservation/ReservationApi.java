package org.example.foodtruckback.common.constants.reservation;

import org.example.foodtruckback.common.constants.ApiBase;
import org.example.foodtruckback.common.constants.user.UserApi;

public class ReservationApi {
    private ReservationApi() {}

    public static final String ROOT = ApiBase.BASE + "/reservations";

    public static final String BY_ID = "/{reservationId}";
    public static final String CANCEL = BY_ID + "/cancel";
    public static final String CONFIRM = BY_ID + "/confirm";
    public static final String NO_SHOW = BY_ID + "/no-show";
}
