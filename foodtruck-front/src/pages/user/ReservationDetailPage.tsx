import styled from '@emotion/styled';
import React, { useState } from 'react'
import MyPageSide from './MyPageSide';
import ReservationDetail from '@/components/reservation/ReservationDetail';
import { useNavigate } from 'react-router-dom';

function ReservationDetailPage() {
  const navigate = useNavigate();

  return (
    <Container>
      <MyPageSide 
        active="reservations"
        onChange={(tab) => {
          if(tab === "profile") return navigate("/mypage");
          if(tab === "reservations") return navigate("/mypage");
        }}
      />

      <Content>
        <ReservationDetail />
      </Content>
    </Container>
  )
}

export default ReservationDetailPage

const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 56px)
`;

const Content = styled.main`
  flex: 1;
  padding: 32px;
  background-color: #fafafa;
`;