import {
  type RoleListResponse,
} from "@/types/role/role.dto";
import { privateApi, publicApi } from "../common/axiosInstance";
import { ROLE_PATH } from "./role.path";
import type { ApiResponse } from "@/types/common/ApiResponse";
import { USER_PATH } from "../user/user.path";

export const roleApi = {
  // 권한 목록
  getroleList: async (): Promise<RoleListResponse> => {
    const res = await publicApi.get<ApiResponse<RoleListResponse>>(
      ROLE_PATH.LISt
    );

    return res.data.data;
  }
};
