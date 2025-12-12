import { publicApi } from "../common/axiosInstance";
import { MENU_PATH } from "./menu.path";
import type { ApiResponse } from "@/types/common/ApiResponse";

import type {
  MenuCreateRequest,
  MenuUpdateRequest,
  MenuDetailResponse,
  MenuListResponse,
} from "@/types/menu/menu.dto";

export const menuApi = {
  createMenu: async (
    body: MenuCreateRequest): Promise<MenuDetailResponse> => {
    const res = await publicApi.post<ApiResponse<MenuDetailResponse>>(
      MENU_PATH.ROOT,
      body
    );

    return res.data.data;
  },

  getMenuById: async (menuId: number): Promise<MenuDetailResponse> => {
    const res = await publicApi.get<ApiResponse<MenuDetailResponse>>(
      MENU_PATH.BY_ID(menuId)
    );
    
    return res.data.data;
  },

  updateMenu: async (menuId: number, body: MenuUpdateRequest): Promise<MenuDetailResponse> => {
    const res = await publicApi.patch<ApiResponse<MenuDetailResponse>>(
      MENU_PATH.UPDATE(menuId),
      body
    );

    return res.data.data;
  },

  deleteMenu: async (menuId: number): Promise<void> => {
    await publicApi.delete<ApiResponse<void>>(MENU_PATH.DELETE(menuId));
  },

  toggleSoldOut: async (menuId: number): Promise<MenuDetailResponse> => {
    const res = await publicApi.patch<ApiResponse<MenuDetailResponse>>(
      MENU_PATH.SOLD_OUT(menuId)
    );

    return res.data.data;
  },
};