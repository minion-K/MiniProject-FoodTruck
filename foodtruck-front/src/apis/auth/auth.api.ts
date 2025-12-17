import { privateApi, publicApi } from "../common/axiosInstance";
import type {
  FindIdRequest,
  FindIdResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  PasswordResetRequest,
  RefreshRequest,
  ResetVerifyResponse,
  SendEmailRequest,
  SignupRequest,
  SignupResponse,
} from "@/types/auth/auth.dto";
import { AUTH_PATH } from "./auth.path";
import type { ApiResponse } from "@/types/common/ApiResponse";

export const authApi = {
  // 회원가입
  signup: async (req: SignupRequest): Promise<SignupResponse> => {
    const res = await publicApi.post<ApiResponse<SignupResponse>>(
      AUTH_PATH.SIGNUP,
      req
    );

    return res.data.data;
  },

  // 로그인
  login: async (req: LoginRequest): Promise<LoginResponse> => {
    const res = await publicApi.post<ApiResponse<LoginResponse>>(
      AUTH_PATH.LOGIN,
      req
    );

    return res.data.data;
  },

  // 로그아웃
  logout: async (req: LogoutRequest): Promise<void> => {
    const res = await privateApi.post<ApiResponse<void>>(AUTH_PATH.LOGOUT, req);

    return res.data.data;
  },

  // 아이디 찾기
  findId: async (req: FindIdRequest): Promise<FindIdResponse> => {
    const res = await publicApi.post<ApiResponse<FindIdResponse>>(
      AUTH_PATH.FINDID,
      req
    );

    return res.data.data;
  },

  resetPW: async (req: PasswordResetRequest): Promise<ResetVerifyResponse> => {
    const res = await publicApi.post<ApiResponse<ResetVerifyResponse>>(
      AUTH_PATH.RESETPW,
      req
    );

    return res.data.data;
  },

  // 리프레시
  refresh: async (req: RefreshRequest): Promise<void> => {
    const res = await publicApi.post<ApiResponse<void>>(AUTH_PATH.REFRESH, req);

    return res.data.data;
  },

  // 이메일 전송
  sendEmail: async (req: SendEmailRequest): Promise<void> => {
    const res = await publicApi.post<ApiResponse<void>>(
      `${AUTH_PATH.SENDEMAIL}`,
      req
    );

    return res.data.data;
  },

  // 이메일 인증
  verifyEmail: async (token: string): Promise<void> => {
    const res = await publicApi.get<ApiResponse<void>>(
      `${AUTH_PATH.VERIFYEMAIL}?token=${token}`
    );

    return res.data.data;
  },
};
