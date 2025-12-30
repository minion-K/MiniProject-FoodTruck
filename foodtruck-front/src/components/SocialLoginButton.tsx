import styled from '@emotion/styled';
import React from 'react'
import googleIcon from '@/assets/images/web_light_rd_na@4x.png';
import kakaoIcon from '@/assets/images/free-icon-kakao-talk-4494622.png';
import naverIcon from '@/assets/images/NAVER_login_Light_KR_green_icon_H48.png';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

const FRONT_REDIRECT_URL = import.meta.env.VITE_OAUTH2_REFIRECT_URL ?? "http://localhost:5173/oauth2/callback";

function SocialLoginButton() {
  const handleSocialLogin = (provider: "google" | "kakao" | "naver") => {
    const authUrl = `${API_BASE_URL}/oauth2/authorization/${provider}?redirect_uri=${encodeURIComponent(
      FRONT_REDIRECT_URL
    )}`;

    window.location.href = authUrl;
  }
  
  return (
    <Container>
      <SocialButton bg={googleIcon} onClick={() => handleSocialLogin("google")} aria-label="Google 로그인"/>
      <SocialButton bg={kakaoIcon} onClick={() => handleSocialLogin("kakao")} aria-label="Kakao 로그인"/>
      <SocialButton bg={naverIcon} onClick={() => handleSocialLogin("naver")} aria-label="Naver 로그인"/>
    </Container>
  )
}

export default SocialLoginButton

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 16px;
`;

const SocialButton = styled.button<{bg: string}>`
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;

  background-image: url(${props => props.bg});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;

  transition: transform 0.15s ease box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  }

  &:active {
    transform: scale(0.95);
  }
`;