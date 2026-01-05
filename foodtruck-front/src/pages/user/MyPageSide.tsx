import styled from '@emotion/styled';
import React, { act } from 'react'

interface Props {
  active: "reservations" | "profile";
  onChange: (tab: "reservations" | "profile") => void;
}

function MyPageSide({active, onChange}: Props) {
  return (
    <Sidebar>
      <Title>마이페이지</Title>

      <Menu>
        <MenuItem
          active={active === "profile"}
          onClick={() => onChange("profile")}
        >
        회원 정보
        </MenuItem>

        <MenuItem
          active={active === "reservations"}
          onClick={() => onChange("reservations")}
        >
          예약 내역
        </MenuItem>
      </Menu>
    </Sidebar>
  )
}

export default MyPageSide

const Sidebar = styled.aside`
  width: 220px;
  background-color: #fff;
  border-right: 1px solid #eee;
  padding: 24px 16px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 24px;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MenuItem = styled.div<{active: boolean}>`
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;

  background-color: ${({active}) => 
    active ? "#ffb600" : "transparent"};
  color: ${({active}) => (active ? "#fff" : "#333")};

  &:hover {
    background-color: ${({active}) => 
      active ? "#ff6b00" : "#f2f2f2"};
  }
`;