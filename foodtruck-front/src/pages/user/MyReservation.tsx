import { reservationApi } from '@/apis/reservation/reservation.api';
import { type ReservationListResponse } from '@/types/reservation/reservation.dto'
import { formatTime } from '@/utils/date';
import { getErrorMsg } from '@/utils/error';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function MyReservation() {
  const [reservations, setReservations] = useState<ReservationListResponse>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await reservationApi.getReservationList();

        setReservations(data);
      } catch (err) {
        getErrorMsg(err);
      } finally {
        setLoading(false);
      }
    }

    fetchReservations();
  }, []);

  if(loading) return <LoadingMsg>예약 내역 불러오는 중...</LoadingMsg>

  if(reservations.length === 0) {
    return <Empty>예약 내역이 없습니다.</Empty>
  }

  return (
    <Container>
      <h1>예약 목록</h1>
      {reservations.map(reservation => (
        <Card
          key={reservation.id}
          onClick={() => navigate(`/mypage/reservation/${reservation.id}`)}
        >
          <Row>
            <Title>{reservation.truckName}</Title>
            <Status status={reservation.status}>
              {reservation.status}
            </Status>
          </Row>

          <Location>
            {reservation.locationName}
          </Location>

          <Info>
            픽업 시간: {formatTime(new Date(reservation.pickupTime)).toLocaleString()}
          </Info>
          <Info>
            결제 금액: {reservation.totalAmount?.toLocaleString() ?? "-s"} KRW
          </Info>
        </Card>
      ))} 
    </Container>
  )
}

export default MyReservation

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LoadingMsg = styled.div``;

const Card = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid #eee;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const Location = styled.div`
  font-size: 13px;
  color: #777;
  margin-bottom: 8px;
`;

const Info = styled.div`
  margin: 4px 0;
  font-size: 14px;
  color: #555;
`;

const Empty = styled.div`
  text-align: center;
  color: #888;
  margin-top: 80px;
`;

const Status = styled.span<{status: string}>` 
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 8px;

  background-color: ${({status}) => {
    switch(status) {
      case "PENDING": return "#fff3cd";
      case "CONFIRMED": return "#d1e7dd";
      case "CANCELED": return "#f8d7da";
      default: return "#eee";
    }
  }};
`;