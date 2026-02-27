import { reservationApi } from '@/apis/reservation/reservation.api';
import type { ReservationDetailResponse } from '@/types/reservation/reservation.dto';
import { formatPickupRange } from '@/utils/date';
import { getErrorMsg } from '@/utils/error';
import { getPaymentStatus } from '@/utils/paymentStatus';
import { getReservationStatus } from '@/utils/reservationStatus';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'

interface Props {
  reservationId: number;
  onClose: () => void;
  onUpdated?: () => void;
}

function ReservationDetailModal({reservationId, onClose, onUpdated}: Props) {
  const [detail, setDetail] = useState<ReservationDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDetail = async () => {
      try {
        const res = await reservationApi.getReservationById(reservationId);

        setDetail(res);
      } catch (e) {
        alert(getErrorMsg(e));
      }
    }

  useEffect(() => {
    fetchDetail();
  }, [reservationId]);

  const handleConfirm = async () => {
    if(!detail) return;

    try {
      setLoading(true);

      await reservationApi.updateStatus(detail.id, {status: "CONFIRMED"});

      onUpdated?.();
      onClose();
    } catch (e) {
      alert(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if(!detail) return;

    try {
      setLoading(true);

      await reservationApi.cancelReservation(detail.id);

      onUpdated?.();
      onClose();
    } catch (e) {
      alert(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };

  if(!detail) return null;

  const reservationStatus = getReservationStatus(detail.status);
  const paymentStatus = getPaymentStatus(detail.paymentStatus);

  const now = new Date();
  const pickupTime = new Date(detail.pickupTime);

  const canCancel = detail.status != "CANCELED" && pickupTime > now;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>예약 상세</Title>

        <Divider />

        <Row>
          <Label>예약자</Label>
          <Value>{detail.username}</Value>
        </Row>

        <Row>
          <Label>픽업 시간</Label>
          <Value>{formatPickupRange(detail.pickupTime)}</Value>
        </Row>

        <Row>
          <Label>예약 상태</Label>
          <Status style={{background: reservationStatus.color}}>
            {reservationStatus.label}
          </Status>
        </Row>

        <Row>
          <Label>결제 상태</Label>
          <Status style={{background: paymentStatus.color}}>
            {paymentStatus.label}
          </Status>
        </Row>

        <MenuSection>
          <SectionTitle>메뉴</SectionTitle>
          {detail.menus?.map(item => (
            <MenuItem key={item.menuItemId}>
              <span>{item.name}</span>
              <span>{item.quantity}개</span>
            </MenuItem>
          ))}
        </MenuSection>

        <Actions>
          <Button 
            primary 
            disabled={detail.status !== "PENDING" || loading} 
            onClick={handleConfirm}
          >
            예약 확정
          </Button>

          <Button 
            danger
            disabled={!canCancel ||loading} 
            onClick={handleCancel}
          >
            예약 취소</Button>
        </Actions>
        
        <CloseButton onClick={onClose}>X 닫기</CloseButton>
      </Modal>
    </Overlay>
  )
}

export default ReservationDetailModal

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  width: 480px;
  background: white;
  padding: 24px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Title = styled.h3`
  margin: 0;
`;

const Divider = styled.div`
  height: 1px;
  background: #e5e7db;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.div`
  font-weight: 600;
  color: #374151;
`;

const Value = styled.div`
  color: #333;
`;

const Status = styled.span`
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 8px;
`;

const SectionTitle = styled.div`
  font-weight: 600;
  margin-bottom: 6px;
`;

const MenuSection = styled.div`
  margin-top: 12px;
`

const MenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding: 4px 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
`;

const Button = styled.button<{
  primary?: boolean;
  danger?: boolean;
}>`
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: none;
  cursor: ${({disabled}) => disabled ? "not-allowed" : "pointer"};

  background: ${({disabled, primary, danger}) => 
    disabled ? "#e5e7eb" 
    : primary ? "#ff6b00" 
    : danger ? "#ef4444" 
    : "#e5e7db"
    };
  
  color: ${({disabled, primary, danger}) => 
    disabled ? "#9ca3af"
    : primary || danger ? "white" : "#374151"};

  &:hover {
    opacity: 0.9;
  }
`;

const CloseButton = styled.button`
  margin-top: 10px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: white;
  cursor: pointer;

  &:hover {
    opacity: #f3f4f6;
  }
`;