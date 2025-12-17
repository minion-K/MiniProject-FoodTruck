package org.example.foodtruckback.common.constants.auth;

import org.example.foodtruckback.common.constants.ApiBase;

public class AuthApi {
    private AuthApi() {}

    public static final String ROOT = ApiBase.BASE + "/auth";

    public static final String SIGNUP = "/signup";
    public static final String LOGIN = "/login";
    public static final String LOGINID_FIND = LOGIN + "/find";
    public static final String LOGOUT = "/logout";
    public static final String REFRESH = "/refresh";
    public static final String PASSWORD = "/password";
    public static final String PASSWORD_RESET = PASSWORD + "/reset";
    public static final String PASSWORD_VERIFY = PASSWORD + "/verify";

}
