import type {
  MeReponse,
  UserDetailResponse,
  UserListResponse,
  UserUpdateRequest,
  UserUpdateResponse,
} from "@/types/user/user.dto";
import { privateApi } from "../common/axiosInstance";
import { USER_PATH } from "./user.path";
import type { ApiResponse } from "@/types/common/ApiResponse";
import type { RoleCreateRequest, RoleCreateResponse } from "@/types/role/role.dto";

export const userApi = {
  // 마이 프로필
  me: async (): Promise<MeReponse> => {
    const res = await privateApi.get<ApiResponse<MeReponse>>(
      USER_PATH.ME
    );
    
    return res.data.data;
  },

  // 내 정보 수정
  updateMe: async (req: UserUpdateRequest) => {
    const res = await privateApi.put<ApiResponse<UserUpdateResponse>>(
      USER_PATH.UPDATE, req
    );

    return res.data.data;
  },

  // 전체 조회
  getUserList: async (): Promise<UserListResponse> => {
    const res = await privateApi.get<ApiResponse<UserListResponse>>(
      USER_PATH.LIST
    );

    return res.data.data;
  },

  // 단건 조회
  getUser: async (userId: number): Promise<UserDetailResponse> => {
    const res = await privateApi.get<ApiResponse<UserDetailResponse>>(
      USER_PATH.BYID(userId)
    );

    return res.data.data;
  },

  // 사용자 수정
  updateUser: async (req: UserUpdateRequest, userId: number) => {
    const res = await privateApi.put<ApiResponse<UserUpdateResponse>>(
      USER_PATH.USERUPDATE(userId), req
    );

    return res.data.data;
  },
  // 권한 추가
  add: async (userId: number, req: RoleCreateRequest): Promise<RoleCreateResponse> => {
    const res = await privateApi.post<ApiResponse<RoleCreateResponse>>(
      USER_PATH.ROLEADD(userId), req
    );

    return res.data.data;
  },

  // 권한 제거
  delete: async (userId: number, roleName: string): Promise<void> => {
    const res = await privateApi.delete<ApiResponse<void>>(
      USER_PATH.ROLEDELETE(userId, roleName)
    );

    return res.data.data;
  }
};
