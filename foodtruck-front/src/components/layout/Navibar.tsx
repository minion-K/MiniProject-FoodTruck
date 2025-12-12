import styled from '@emotion/styled';
import React from 'react'
import { Link } from 'react-router-dom';

function Navibar() {
  return (
    <NavContainer>
      <NavItem><Link to="/">홈</Link></NavItem>
      <NavItem><Link to="/trucklist">트럭 리스트</Link></NavItem>
      <NavItem>즐겨찾기</NavItem>
      <NavItem>공지</NavItem>
      
    </NavContainer>
  )
}

export default Navibar

const NavContainer = styled.nav`
  display: flex;
  gap: 12px;
  padding: 10px 16px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
`;

const NavItem = styled.div`
  cursor: pointer;

  &:hover {
    color: #5b54ff;
  }
`;