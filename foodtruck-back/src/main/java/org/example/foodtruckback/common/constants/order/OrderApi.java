package org.example.foodtruckback.common.constants.order;

import org.example.foodtruckback.common.constants.ApiBase;

public class OrderApi {
    private OrderApi() {}

    public static final String ROOT = ApiBase.BASE + "/orders";

    public static final String BY_ID = "/{orderId}";

    // get order user
    public static final String ME = "/me";

    //get order owner
    public static final String TRUCK = "/trucks/{truckId}";

    // cancel
    public static final String CANCEL = BY_ID + "/cancel";
    // refund
    public static final String REFUND = BY_ID + "/refund";
}