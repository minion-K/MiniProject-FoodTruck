package org.example.foodtruckback.common.constants.truck;

import org.example.foodtruckback.common.constants.ApiBase;

public class TruckApi {
    private TruckApi() {}

    public static final String ROOT = ApiBase.BASE + "/trucks";

    public static final String BY_ID = "/{truckId}"; 
    public static final String OWNER = "/owner";
}
