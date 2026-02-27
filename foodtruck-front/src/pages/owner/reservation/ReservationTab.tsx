import { reservationApi } from '@/apis/reservation/reservation.api';
import type { OwnerReservationListResponse } from '@/types/reservation/reservation.dto';
import { formatPickupRange } from '@/utils/date';
import { getErrorMsg } from '@/utils/error';
import { getPaymentStatus } from '@/utils/paymentStatus';
import { getReservationStatus } from '@/utils/reservationStatus';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'
StyleSheet
interface Props {
  scheduleId: number;
  onSelect: (id: number) => void;
}

function ReservationTab({scheduleId, onSelect}: Props) {
  const [reservations, setReservations] = useState<OwnerReservationListResponse>([]);
  const [loading, setLoading] = useState(false);

  const fetchReservation = async () => {
    try {
      setLoading(true);

      const res = await reservationApi.getOwnerReservations(scheduleId);
      setReservations(res);
    } catch (e) {
      alert(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(!scheduleId) return;

    fetchReservation();
  }, [scheduleId]);

  if(loading) return <Loading>로딩 중...</Loading>
  if(reservations.length === 0) return <EmptyText>예약 내역이 없습니다.</EmptyText>

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            <th style={{width: "12%"}}>예약자</th>
            <th style={{width: "18%"}}>픽업 시간</th>
            <th style={{width: "22%"}}>주문 메뉴</th>
            <th style={{width: "8%"}}>수량</th>
            <th style={{width: "10%"}}>금액</th>
            <th style={{width: "10%"}}>예약 상태</th>
            <th style={{width: "10%"}}>결제 상태</th>
            <th style={{width: "10%"}}>관리</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(reservation => {
            const reservationStatus = getReservationStatus(reservation.status);
            const paymentStatus = getPaymentStatus(reservation.paymentStatus);
            const menuItems = reservation.menus ?? [];


            const totalAmount = menuItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );

            const totalQuantity = menuItems.reduce(
              (sum, item) => sum + item.quantity,
              0
            );

            const menuSummary = menuItems.length === 0
              ? "메뉴 정보 없음"
              : menuItems.length === 1
              ? `${menuItems[0].name} ${menuItems[0].quantity}개`
              : `${menuItems[0].name} 외 ${menuItems.length - 1}건`

            const menuText = menuItems.length === 0
              ? "메뉴 정보 없음"
              : menuItems
                .map(item => `${item.name} ${item.quantity}개`)
                .join(", ");

            return (
              <tr key={reservation.id}>
                <td>{reservation.userName}</td>
                <td>{formatPickupRange(reservation.pickupTime)}</td>
                <td title={menuText}>{menuSummary}</td>
                <td>{totalQuantity}개</td>
                <td>{totalAmount.toLocaleString()}KRW</td>
                <td>
                  <Status style={{background: reservationStatus.color}}>
                    {reservationStatus.label}
                  </Status>
                </td>
                <td>
                  <Status style={{background: paymentStatus.color}}>
                    {paymentStatus.label}
                  </Status>
                </td>
                <td>
                  <ButtonWrapper>
                    <Button onClick={() => onSelect(reservation.id)}>
                      상세보기
                    </Button>
                  </ButtonWrapper>
                </td>
              </tr>
            )
          })}
        </tbody>
      </StyledTable>
    </TableWrapper>

  )
}

export default ReservationTab

const TableWrapper = styled.div`
  margin-top: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow-x: auto;
  background: white;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
  table-layout: fixed;

  th, td {
    padding: 12px 16px;
    text-align: left;
    font-size: 14px;
    border-bottom: 1px solid #f1f1f1;
    white-space: nowrap;
  }

  th {
    background: #f3f4f6;
    font-weight: 600;
    font-size: 13px;
    color: #374151;
  }

  tbody tr:hover {
    background: #f9fafb;
  }
`;

const Status = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  width: 80px;
  padding: 2px 6px;
  border-radius: 8px;
  text-align: center;

  white-space: nowrap;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Button = styled.button<{
  primary?: boolean;
  danger?: boolean;
}>`
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 8px;
  border: none;

  background: ${({primary, danger}) => primary ? "#ff6b00" : danger ? "#ef4444" : "white"};
  color: ${({primary, danger}) => primary || danger ? "white" : "#374151"};
  border: ${({primary, danger}) => primary || danger ? "none" : "1px solid #d1d5db"};

  &:hover {
    opacity: 0.9;
  }
`;

const EmptyText = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-size: 14px;
`;

const Loading = styled.div`
  padding: 40px;
  text-align: center;
  font-size: 16px;
  color: #6b7280;
`;