package org.example.foodtruckback.common.constants.user;

import org.example.foodtruckback.common.constants.ApiBase;

public class UserApi {
    private UserApi() {}

    public static final String ROOT = ApiBase.BASE + "/users";

    public static final String ME = "/me";
    public static final String BY_ID = "/{userId}";

    public static final String ROLES = "/roles";
    public static final String DELETE = BY_ID + ROLES + "/{roleName}";
}
