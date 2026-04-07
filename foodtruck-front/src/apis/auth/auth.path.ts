import { BASE } from "../common/base.path";

const AUTH_PREFIX = `${BASE}/auth`;

export const AUTH_PATH = {
  ROOT: AUTH_PREFIX,

  SIGNUP: `${AUTH_PREFIX}/signup`,
  LOGIN: `${AUTH_PREFIX}/login`,
  LOGOUT: `${AUTH_PREFIX}/logout`,
  REFRESH: `${AUTH_PREFIX}/refresh`,
  FIND_ID: `${AUTH_PREFIX}/find-id`,
  RESET_PW: `${AUTH_PREFIX}/password-reset`,
  RESET_PW_EMAIL: `${AUTH_PREFIX}/password-reset-email`,
  PASSWORD_VERIFY: `${AUTH_PREFIX}/password-verify`,
  SENDEMAIL: `${AUTH_PREFIX}/send-email`,
  VERIFYEMAIL: `${AUTH_PREFIX}/email/verify`,
  EMAIL_CHANGE: `${AUTH_PREFIX}/email/change`,
  EMAIL_CHANGE_CONFIRM: `${AUTH_PREFIX}/email/change/confirm`
};
