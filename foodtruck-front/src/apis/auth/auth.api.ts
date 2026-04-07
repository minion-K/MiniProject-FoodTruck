import { privateApi, publicApi } from "../common/axiosInstance";
import type {
  FindIdRequest,
  FindIdResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  PasswordResetRequest,
  RefreshRequest,
  ResetPWEmailRequest,
  ResetPWResponse,
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
      AUTH_PATH.FIND_ID,
      req
    );

    return res.data.data;
  },

  resetPW: async (req: PasswordResetRequest): Promise<ResetPWResponse> => {
    const res = await publicApi.post<ApiResponse<ResetPWResponse>>(
      AUTH_PATH.RESET_PW,
      req
    );

    return res.data.data;
  },

  resetPWEmail: async(req: ResetPWEmailRequest): Promise<void> => {
    const res = await publicApi.post<ApiResponse<void>>(
      AUTH_PATH.RESET_PW_EMAIL,
      req
    );

    return res.data.data;
  },

  passwordVerify: async(token: string): Promise<boolean> => {
    const res = await publicApi.get<ApiResponse<{valid: boolean}>>(
      `${AUTH_PATH.PASSWORD_VERIFY}?token=${token}`,
    );

    return res.data.data.valid;
  },

  // 리프레시
  refresh: async (req: RefreshRequest): Promise<void> => {
    const res = await publicApi.post<ApiResponse<void>>(
      AUTH_PATH.REFRESH, req
    );

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

  // 이메일 변경 시 메일 발송
  sendEmailChange: async (req: SendEmailRequest): Promise<void> => {
    const res = await privateApi.post<ApiResponse<void>>(
      `${AUTH_PATH.EMAIL_CHANGE}`,
      req
    );

    return res.data.data;
  },

  // 이메일 변경 확인
  confirmEmailChange: async (token: string): Promise<void> => {
    const res = await privateApi.get<ApiResponse<void>>(
      `${AUTH_PATH.EMAIL_CHANGE_CONFIRM}?token=${token}`
    );

    return res.data.data;
  }
};
