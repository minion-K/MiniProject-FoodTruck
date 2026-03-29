import type {
  AdminUserUpdateRequest,
  UserDetailResponse,
  UserListResponse,
  UserStatusUpdateResponse,
  UserUpdateRequest
} from "@/types/user/user.dto";
import { privateApi } from "../common/axiosInstance";
import { USER_PATH } from "./user.path";
import type { ApiResponse } from "@/types/common/ApiResponse";
import type { RoleCreateRequest, RoleCreateResponse } from "@/types/role/role.dto";
import type { RoleType } from "@/types/role/role.type";
import type { UserStatus } from "@/types/user/user.type";

export const userApi = {
  // 마이 프로필
  me: async (): Promise<UserDetailResponse> => {
    const res = await privateApi.get<ApiResponse<UserDetailResponse>>(
      USER_PATH.ME
    );
    
    return res.data.data;
  },

  // 내 정보 수정
  updateMe: async (req: UserUpdateRequest) => {
    const res = await privateApi.put<ApiResponse<UserDetailResponse>>(
      USER_PATH.UPDATE, req
    );

    return res.data.data;
  },
  
  // 전체 조회
  getUserList: async (params?: {
    role?: RoleType;
    page?: number;
    size?: number;
    keyword?: string;
    status?: UserStatus
    sortKey?: "createdAt" | "email"
  }): Promise<UserListResponse> => {
    const res = await privateApi.get<ApiResponse<UserListResponse>>(
      USER_PATH.LIST, {params}
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
  updateUser: async (req: AdminUserUpdateRequest, userId: number) => {
    const res = await privateApi.put<ApiResponse<UserDetailResponse>>(
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
  delete: async (userId: number, role: RoleType): Promise<void> => {
    const res = await privateApi.delete<ApiResponse<void>>(
      USER_PATH.ROLEDELETE(userId, role)
    );

    return res.data.data;
  },

  toggleStatus: async (userId: number): Promise<UserStatusUpdateResponse> => {
    const res = await privateApi.post<ApiResponse<UserStatusUpdateResponse>>(
      USER_PATH.TOGGLE_STATUS(userId)
    );

    return res.data.data;
  }
};
