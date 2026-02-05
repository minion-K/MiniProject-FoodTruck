import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <SidebarContainer isOpen={isOpen}>
      <div className="sidebar-header">
        <span>트럭 운영자 메뉴</span>
      </div>
      <nav className="items">
        <Link to="/owner">내 트럭</Link>
        <Link to="/owner/reservations">예약 / 주문 관리</Link>
        <Link to="/owner/payments">결제 관리</Link>
        <Link to="/owner/statistics">통계 / 매출</Link>
      </nav>
    </SidebarContainer>
  );
}

export default Sidebar;

interface SidebarContainerProps {
  isOpen: boolean;
}

const SidebarContainer = styled.aside<SidebarContainerProps>`
  display: flex;
  flex-direction: column;
  inset: 0 auto 0 0;

  width: ${({ isOpen }) => (isOpen ? "240px" : "0")};
  min-width: 0;
  overflow: hidden;
  background: white;
  border-radius: 1px solid #e5e7eb;

  transform: translateX(${({ isOpen }) => (isOpen ? "0" : "-100%")});
  transition: transform 0.25s ease;

  .sidebar-header {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0 16px;
    border-bottom: 1px solid #e5e7eb;
  }

  .items {
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 8px;

    a {
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;

      &:hover {
        background-color: var(--primary);
        color: white;
      }
    }
  }
`;
