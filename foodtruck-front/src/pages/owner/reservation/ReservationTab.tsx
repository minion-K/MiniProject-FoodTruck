import { reservationApi } from '@/apis/reservation/reservation.api';
import Pagination from '@/components/common/Pagination';
import type { OwnerReservationListItemResponse } from '@/types/reservation/reservation.dto';
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
  const [reservations, setReservations] = useState<OwnerReservationListItemResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);

  const fetchReservation = async () => {
    try {
      setLoading(true);

      const res = await reservationApi.getOwnerReservations({
        scheduleId,
        page,
        size: 10
      });

      setReservations(res.content);
      setTotalPage(res.totalPage)
    } catch (e) {
      alert(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
  }, [])

  useEffect(() => {
    if(!scheduleId) return;

    fetchReservation();
  }, [scheduleId, page]);

  if(loading) return <Loading>로딩 중...</Loading>

  return (
    <>
      <Header>
        <Title>예약 관리</Title>
      </Header>

      {reservations.length === 0 ? (
        <EmptyText>예약 내역이 없습니다.</EmptyText>
      ) : (
      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <th style={{width: "12%"}}>예약자</th>
              <th style={{width: "15%"}}>픽업 시간</th>
              <th style={{width: "18%"}}>주문 메뉴</th>
              <th style={{width: "8%"}} className="center">수량</th>
              <th style={{width: "12%"}} className="center">금액</th>
              <th style={{width: "10%"}} className="center">예약 상태</th>
              <th style={{width: "10%"}} className="center">결제 상태</th>
              <th style={{width: "10%"}} className="center">관리</th>
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
                  <td className="center">{totalQuantity}개</td>
                  <td className="center">{totalAmount.toLocaleString()}KRW</td>
                  <td className="center">
                    <StatusWrapper>
                      <Status style={{background: reservationStatus.color}}>
                        {reservationStatus.label}
                      </Status>
                    </StatusWrapper>
                  </td>
                  <td className="center">
                    <StatusWrapper>
                      <Status style={{background: paymentStatus.color}}>
                        {paymentStatus.label}
                      </Status>
                    </StatusWrapper>
                  </td>
                  <td className="center">
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
      )}
      <Pagination 
        page={page}
        totalPage={totalPage}
        onChange={setPage}
      />
    </>


  )
}

export default ReservationTab

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
`;

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

  th.center, td.center {
    text-align: center;
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

const StatusWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
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
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 8px;
  border: none;

  background: white;
  color: #374151;
  border: 1px solid #d1d5db;

  &:hover {
    background: #e5e7eb;
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