package org.example.foodtruckback.common.constants.auth;

import org.example.foodtruckback.common.constants.ApiBase;

public class AuthApi {
    private AuthApi() {}

    public static final String ROOT = ApiBase.BASE + "/auth";

    public static final String SIGNUP = "/signup";
    public static final String LOGIN = "/login";
    public static final String FIND_ID =  "/find-id";
    public static final String LOGOUT = "/logout";
    public static final String REFRESH = "/refresh";
    public static final String PASSWORD_RESET_MAIL = "/password-reset-email";
    public static final String PASSWORD_RESET = "/password-reset";
    public static final String PASSWORD_VERIFY = "/password-verify";
    public static final String SEND_EMAIL = "/send-email";
    public static final String VERIFY = "/email/verify";
    public static final String CHANGE_EMAIL = "email/change";
    public static final String EMAIL_CHANGE_CONFIRM = "/email/change/confirm";

}
