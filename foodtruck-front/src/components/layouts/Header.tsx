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
  return (
    <HeaderContainer>
      <div className="sidebar-btn" onClick={onToggleSidebar}>
        <div className="hamburger"></div>
        <div className="hamburger hamburger2"></div>
        <div className="hamburger"></div>
      </div>
      <HeaderText>Food Truck</HeaderText>
      <HeaderRight>
        {isLogged ? (
          <>
            <UserName>{user?.name} 님, 환영합니다.</UserName>
            <Logout onClick={clearAuth}>로그아웃</Logout>
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
  padding: 10px 16px;
  background: #f1f1f1;
  border-bottom: 1px solid #ccc;

  .hamburger {
    width: 25px;
    border: 1.9px solid black;
    transition: width 0.2s ease;
  }

  .sidebar-btn {
    display: flex;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
  }

  .sidebar-btn:hover > .hamburger2 {
    width: 15px;
  }
`;

const HeaderText = styled.h1`
  text-align: center;
  color: var(--primary);
`;

const HeaderRight = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
`;

const LoginBtn = styled.div`
  cursor: pointer;
  background-color: var(--primary);
  color: white;
  padding: 6px 8px;
  border-radius: 8px;

  &:hover {
    background-color: #5b54ff;
  }
`;

const UserName = styled.div`
  font-weight: 600;
  margin-top: 8px;
  margin-right: 16px;
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