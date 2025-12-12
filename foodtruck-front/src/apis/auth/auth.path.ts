import { BASE } from "../common/base.path";

const AUTH_PREFIX = `${BASE}/auths`;

export const AUTH_PATH = {
  ROOT: AUTH_PREFIX,

  SIGNUP: `${AUTH_PREFIX}/signup`,
  LOGIN: `${AUTH_PREFIX}/login`,
  LOGOUT: `${AUTH_PREFIX}/logout`,
  REFRESH: `${AUTH_PREFIX}/refresh`,
  FINDID: `${AUTH_PREFIX}/find-id`,
  RESETPW: `${AUTH_PREFIX}/reset-pw`
}