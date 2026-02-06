package org.example.foodtruckback.common.constants.menu;

import org.example.foodtruckback.common.constants.ApiBase;
import org.example.foodtruckback.common.constants.truck.TruckApi;

public class MenuApi {
    private MenuApi() {}

    public static final String ROOT = ApiBase.BASE + "/menu";

    public static final String BY_ID = "/{menuId}";
    public static final String TRUCK_MENU_VIEW = "/trucks/{truckId}";
    public static final String SOLD_OUT = BY_ID + "/soldOut";
}
