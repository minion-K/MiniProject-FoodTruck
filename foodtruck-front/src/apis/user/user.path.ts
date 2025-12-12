import { BASE } from "../common/base.path";

const USER_PREFIX = `${BASE}/users`;

export const USER_PATH = {
  ROOT: USER_PREFIX,

  LIST: USER_PREFIX,
  ME: `${USER_PREFIX}/me`,
  UPDATE: `${USER_PREFIX}/me`,
  BYID: (userId: number) => `${USER_PREFIX}/${userId}`,
  USERUPDATE: (userId: number) => `${USER_PREFIX}/${userId}`,
  
  ROLEADD: (userId: number) => `${USER_PREFIX}/${userId}`,
  ROLEDELETE: (userId: number, roleName: string) => `${USER_PREFIX}${userId}/roles/${roleName}`,
};
