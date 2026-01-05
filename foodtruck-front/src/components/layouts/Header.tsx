import { useAuthStore } from "@/stores/auth.store";
import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  onToggleSidebar: () => void;
}

function Header({ onToggleSidebar }: HeaderProps) {
  const {accessToken, user, clearAuth} = useAuthStore();

  const isLogged = accessToken ? true : false;
  const roles = user?.roles ?? [];

  const isOwnerOrAdmin = 
    isLogged && (roles.includes("OWNER") || roles.includes("ADMIN"));
  const isUser = 
    isLogged && roles.includes("USER") && !isOwnerOrAdmin;

  return (
    <HeaderContainer>
      {isOwnerOrAdmin ? (
        <HamburgerBtn onClick={onToggleSidebar}>
          <span />
          <span className="hamburger2"/>
          <span />
        </HamburgerBtn>
      ) : (
        <LeftSpace />
      )}

      <HeaderText><Link to="/">Food Truck</Link></HeaderText>
      <HeaderRight>
        {isLogged ? (
          <>
            <UserName>{user?.name} 님, 환영합니다.</UserName>
            {isUser && (
              <OutlineBtn><Link to="/mypage">마이페이지</Link></OutlineBtn>
            )}
            <OutlineBtn onClick={clearAuth}>로그아웃</OutlineBtn>
          </>
        ) : (
          <>
            <LoginBtn>
              <Link to="/login">로그인</Link>
            </LoginBtn>
            <LoginBtn>
              <Link to="/register">회원가입</Link>
            </LoginBtn>
          </>
        )}
      </HeaderRight>
    </HeaderContainer>
  );
}

export default Header;

const HeaderContainer = styled.header`
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
`;

const LeftSpace = styled.div`
  width: 32px;
`;

const HamburgerBtn = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;

  span {
    height: 3px;
    width: 100%;
    background-color: #555;
    border-radius: 2px;
  }

  &:hover span {
    background-color: #4f46e5;
  }

  &:hover .hamburger2 {
    width: 70%;
  }
`;

const HeaderText = styled.h1`
margin: 0;
  text-align: center;
  font-size: 28px;
  color: #4f46e5;
  cursor: pointer;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LoginBtn = styled.div`
  cursor: pointer;
  font-size: 14px;
  color: #4b5563;
  text-decoration: none;

  &:hover {
    color: #111827;
  }
`;

const UserName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
`;

const Logout = styled.button`
  cursor: pointer;
  background-color: var(--primary);
  color: white;
  padding: 6px 8px;
  border-radius: 8px;
  border: none;

  &:hover {
    background-color: #5b54ff;
  }
`;

const OutlineBtn = styled.button`
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #d1d5db;
  color: #374151;
  cursor: pointer;

  &:hover {
    background-color: #f9fafb;
    border-color: #4f46e5;
    color: #4f46e5;
  }
`;