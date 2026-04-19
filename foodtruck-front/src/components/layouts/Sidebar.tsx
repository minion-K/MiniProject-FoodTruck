import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  role?: "OWNER" | "ADMIN"
}

const ownerMenus = [
  {label: "내 정보", path: "/owner/profile"},
  {label: "내 트럭", path: "/owner/trucks"},
  {label: "예약 · 주문 관리", path: "/owner/reservations"},
  {label: "통계 · 매출", path: "/owner/statistics"},
];

const adminMenus = [
  {label: "내 정보", path: "/admin/profile"},
  {label: "유저 관리", path: "/admin/users"},
  {label: "트럭 관리", path: "/admin/trucks"},
  {label: "예약 · 주문 관리", path: "/admin/reservations"},
  {label: "통계 대시보드", path: "/admin/statistics"},
]

function Sidebar({ isOpen, onClose, role }: SidebarProps) {
  const menus = role === "ADMIN" ? adminMenus : ownerMenus
  const title = role === "ADMIN" ? "관리자 메뉴" : "트럭 운영자 메뉴"
  return (
    <SidebarContainer isOpen={isOpen}>
      <div className="sidebar-header">
        <span>{title}</span>
      </div>
      <nav className="items">
        {menus.map(menu => (
          <Link key={menu.label} to={menu.path} onClick={onClose}>
            {menu.label}
          </Link>
        ))}
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
