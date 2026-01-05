import styled from '@emotion/styled';
import React from 'react'
import ReservationDetail from '@/components/reservation/ReservationDetail';
import { useParams } from 'react-router-dom';
import MyPage from './MyPage';

function ReservationDetailPage() {
  const {reservationId} = useParams<{reservationId: string}>();

  return (
    <MyPage activeTab="reservations">
      <ReservationDetail reservationId={reservationId!}/>
    </MyPage>
  )
}

export default ReservationDetailPage