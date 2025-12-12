package org.example.foodtruckback.common.constants.location;

import org.example.foodtruckback.common.constants.ApiBase;

public class LocationApi {
    private LocationApi() {}

    public static final String ROOT = ApiBase.BASE + "/locations";

    public static final String BY_ID = "/{locationId}";
}
