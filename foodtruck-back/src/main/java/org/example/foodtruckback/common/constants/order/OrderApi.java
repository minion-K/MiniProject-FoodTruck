package org.example.foodtruckback.common.constants.order;

import org.example.foodtruckback.common.constants.ApiBase;

public class OrderApi {
    private OrderApi() {}

    public static final String ROOT = ApiBase.BASE + "/orders";

    public static final String BY_ID = "/{orderId}";
    public static final String ME = "/me";
    public static final String OWNER = "/owner";
    public static final String CANCEL = BY_ID + "/cancel";
    public static final String PAY = BY_ID + "/pay";
    public static final String REFUND = BY_ID + "/refund";
}