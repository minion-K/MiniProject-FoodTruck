import type { RoleType } from "../role/role.type";

// Request //

// 회원가입
export interface SignupRequest {
  name: string;
  loginId: string;
  password: string;
  email: string;
  phone: string;
}

// 로그인
export interface LoginRequest {
  loginId: string;
  password: string;
}

// 로그아웃
export interface LogoutRequest {
  refreshToken: string
}

// 아이디 찾기
export interface FindIdRequest {
  email: string
}

// 비밀번호 찾기
export interface PasswordResetRequest {
  token: string,
  newPassword: string,
  confirmPassword: string
}

// 리프레시 
export interface RefreshRequest {
  refreshToken: string
}

// -------------------------------------------
// Response // 

// 회원가입
export interface SignupResponse {
  name: string;
  loginId: string;
  email: string;
  phone: string;
}

// 로그인
export interface LoginResponse {
  accessToken: string,
  refreshToke: string,
  accessTokenExpiresInMillis: number
}

// 아이디 찾기
export interface FindIdResponse {
  LoginId: string;
}


// 비밀번호 찾기
export interface ResetVerifyResponse {
  valid: boolean,
  email: string
}