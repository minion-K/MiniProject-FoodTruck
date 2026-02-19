import { reservationApi } from '@/apis/reservation/reservation.api';
import type { ReservationListResponse } from '@/types/reservation/reservation.dto';
import { getErrorMsg } from '@/utils/error';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'
StyleSheet
interface Props {
  scheduleId: number;
  onSelect: (data: any) => void;
}

function ReservationTab({scheduleId, onSelect}: Props) {
  const [reservations, setReservations] = useState<ReservationListResponse>([]);
  const [loading, setLoading] = useState(false);

  const fetchReservation = async () => {
    try {
      setLoading(true);

      const res = await reservationApi.getReservationList(scheduleId);
      setReservations(res);
    } catch (e) {
      alert(getErrorMsg(e));
    } setLoading(false);
  };

  useEffect(() => {
    fetchReservation();
  }, [scheduleId]);

  const handleConfirm = async (id: number) => {
    try {
      await reservationApi.updateStatus(id);

      fetchReservation();
    } catch (e) {
      alert(getErrorMsg(e));
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await reservationApi.cancelReservation(id);

      fetchReservation();
    } catch (e) {
      alert(getErrorMsg(e));
    }
  };

  if(loading) return <Loading>로딩 중...</Loading>

  return (
    <Container>
      {reservations.length === 0 && (
        <EmptyText>예약 내역이 없습니다.</EmptyText>
      )}

      {reservations.map(reservation => (
        <Card key={reservation.id}>
          <InfoSection>
            <Row>
              <Label>예약자</Label>
              <Value>{reservation.truckName}</Value>
            </Row>

            <Row>
              <Label>픽업 시간</Label>
              <Value>{reservation.pickupTime}</Value>
            </Row>

            <Row>
              <Label>예약 상태</Label>
              <StatusBadge
                
              >
                {reservation.status}
              </StatusBadge>
            </Row>

            <Row>
              <Label>결제 상태</Label>
              <PaymentBadge
              
              >
                {reservation.paymentStatus}
              </PaymentBadge>
            </Row>
          </InfoSection>

          <ButtonWrapper>
            <Button onClick={() => onSelect(reservation)}>상세보기</Button>

            {reservation.status === "PENDING" && (
              <>
                <Button primary onClick={() => handleConfirm(reservation.id)}>
                  예약 확정
                </Button>
                <Button danger onClick={() => handleCancel(reservation.id)}>
                  취소
                </Button>
              </>
            )}
          </ButtonWrapper>
        </Card>
      ))}
    </Container>  
  )
}

export default ReservationTab

const Container = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Card = styled.div`
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
`;

const Label = styled.div`
  font-weight: 600;
  color: #666;
  width: 90px;
`;

const Value = styled.div`
  color: #222;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button<{
  primary?: boolean;
  danger?: boolean;
}>`
  padding: 6px 10px;
  font-size: 13px;
  cursor: pointer;
  border-radius: 6px;
  border: none;

  background: ${({primary, danger}) => primary ? "#333" : danger ? "#ffdddd" : "#f5f5f5"};
  color: ${({primary}) => primary ? "white" : "black"};

  &:hover {
    opacity: 0.85;
  }
`;

const StatusBadge = styled.div`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
`;

const PaymentBadge = styled.div`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
`;

const EmptyText = styled.div`
  text-align: center;
  padding: 40px;
  color: #888;
`;

const Loading = styled.div`
  font-size: 16px;
`;