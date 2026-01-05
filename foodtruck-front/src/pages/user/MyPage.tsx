import styled from '@emotion/styled'
import React, { useState } from 'react'
import Profile from './Profile';
import MyReservation from './MyReservation';
import MyPageSide from './MyPageSide';

type MyPageTab = "reservations" | "profile";

function MyPage() {
  const [activeTab, setActiveTab] = useState<MyPageTab>("profile");

  return (
    <Container>
      <MyPageSide 
        active={activeTab}
        onChange={setActiveTab}
      />

      <Content>
        {activeTab === "profile" && <Profile />}
        {activeTab === "reservations" && <MyReservation />}
      </Content>
    </Container>
  )
}

export default MyPage

const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 56px)
`;

const Content = styled.main`
  flex: 1;
  padding: 32px;
  background-color: #fafafa;
`;