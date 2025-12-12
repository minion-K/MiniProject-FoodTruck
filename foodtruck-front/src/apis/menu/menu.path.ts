import { BASE } from "../common/base.path";

const MENU_FREFIX = `${BASE}/menu`;

export const MENU_PATH = {
  ROOT: MENU_FREFIX,

  BY_ID: (menuId: number) => `${MENU_FREFIX}/${menuId}`,
  UPDATE: (menuId: number) => `${MENU_FREFIX}/${menuId}`,
  DELETE: (menuId: number) => `${MENU_FREFIX}/${menuId}`,
  
  SOLD_OUT: (menuId: number) => `${MENU_FREFIX}/${menuId}/soldout`
}