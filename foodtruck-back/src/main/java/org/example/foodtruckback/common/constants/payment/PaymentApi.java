package org.example.foodtruckback.common.constants.payment;

import org.example.foodtruckback.common.constants.ApiBase;
import org.example.foodtruckback.common.constants.order.OrderApi;

public class PaymentApi {
    private PaymentApi() {}

    public static final String ROOT = ApiBase.BASE+ "/payments";

    public static final String APPROVE = "/approve";
    public static final String ME = "/me";
    public static final String REFUND = "/{paymentId}/refund";
}
