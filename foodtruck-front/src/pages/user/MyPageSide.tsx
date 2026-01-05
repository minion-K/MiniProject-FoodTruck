import styled from '@emotion/styled';
import React from 'react'

interface Tab {
  key: string;
  label: string;
  content?: React.ReactNode;
}

interface Props {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void
}

function MyPageSide({tabs, active, onChange}: Props) {
  return (
    <Sidebar>
      <Title>마이페이지</Title>

      <Menu>
        {tabs.map(tab => (
          <MenuItem
            key={tab.key}
            active={active === tab.key}
            onClick={() => {onChange(tab.key);}}
          >
            {tab.label}
          </MenuItem>
        ))}
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