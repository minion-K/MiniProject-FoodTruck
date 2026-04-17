import { reservationApi } from '@/apis/reservation/reservation.api';
import Pagination from '@/components/common/Pagination';
import { type AdminReservationListItemResponse } from '@/types/reservation/reservation.dto';
import type { ReservationStatus } from '@/types/reservation/reservation.type';
import { formatDateTime, formatPickupRange } from '@/utils/date';
import { getErrorMsg } from '@/utils/error';
import { getPaymentStatus } from '@/utils/paymentStatus';
import { getReservationStatus } from '@/utils/reservationStatus';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

interface Props {
  keyword: string;
  dateRange: "ALL" | "TODAY" | "WEEK" | "MONTH"
  status: "ALL" | ReservationStatus
}

function AdminReservationTab({keyword, dateRange, status}: Props) {
  const [reservations, setReservations] = useState<AdminReservationListItemResponse[]>([]);
  const [page, setPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await reservationApi.getAdminReservations({
        page,
        size: 10,
        keyword: keyword || undefined,
        dateRange,
        status: status === "ALL" ? undefined : status
      });
  
      setReservations(res.content);
      setTotalPage(res.totalPage);
    } catch (e) {
      alert(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
  }, [status, dateRange, keyword]);

  useEffect(() => {
    fetchReservations();
  }, [page, status, dateRange, keyword]);

  const handleForceCancel = async (reservationId: number) => {
    if(!window.confirm("해당 예약을 강제취소 하시겠습니까?")) return ;

    try {
      await reservationApi.cancelReservation(reservationId);

      fetchReservations();
      toast.success("예약이 강제 취소 되었습니다.");
    } catch (e) {
      alert(getErrorMsg(e));
    }
  };

  return (
    <>
      <HeaderRow>
        <Title>예약 관리</Title>
      </HeaderRow>

      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <th style={{width: "13%"}}>예약정보</th>
              <th style={{width: "12%"}} className="center">메뉴</th>
              <th style={{width: "15%"}} className="center">금액</th>
              <th style={{width: "15%"}} className="center">상태</th>
              <th style={{width: "20%"}} className="center">예약일</th>
              <th style={{width: "10%"}} className="center">관리</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>
                  <Loading>로딩 중...</Loading>
                </td>
              </tr>
            ): (
              reservations.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyText>데이터 없음</EmptyText>
                  </td>
                </tr>
              ) : (
                reservations.map(reservation => {
                  const reservationStatus = getReservationStatus(reservation.status);
                  const paymentStatus = getPaymentStatus(reservation.paymentStatus);
                  const menuItems = reservation.menus ?? [];
                  
                  const totalAmount = menuItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  );

                  const menuSummary = menuItems.length === 0
                    ? "메뉴 정보 없음"
                    : menuItems.length === 1
                    ? `${menuItems[0].name} ${menuItems[0].quantity}개`
                    : `${menuItems[0].name} ${menuItems[0].quantity}개 외 ${menuItems.length - 1}건`

                  const menuText = menuItems.length === 0
                    ? "메뉴 정보 없음"
                    : menuItems
                      .map(item => `${item.name} ${item.quantity}개`)
                      .join(", ");
                  return (
                    <tr key={reservation.id}>
                      <td>
                        <InfoMain>{reservation.truckName}</InfoMain>
                        <InfoSub>픽업: {formatPickupRange(reservation.pickupTime)}</InfoSub>
                        <InfoSub>예약자: {reservation.userName}</InfoSub>
                      </td>
                      <td className="center">
                        <Menu title={menuText}>{menuSummary}</Menu>
                      </td>
                      <td className="center">
                        <Price>{totalAmount} KRW</Price>
                      </td>
                      <td className="center">
                        <StatusWrapper>
                          <StatusBadge style={{background: reservationStatus.color}}>
                            {reservationStatus.label}
                          </StatusBadge>
                          <PaymentBadge style={{background: paymentStatus.color}}>
                            {paymentStatus.label}
                          </PaymentBadge>
                        </StatusWrapper>
                      </td>
                      <td className="center">{formatDateTime(reservation.createdAt)}</td>
                      <td className="center">
                        {reservation.status !== "CANCELED" && (
                          <CancelButton
                            onClick={() => handleForceCancel(reservation.id)}
                          >
                            강제취소
                          </CancelButton>
                        )}
                      </td>
                    </tr>
                  )
                  
                })
              )
              )
            }
          </tbody>
        </StyledTable>
      </TableWrapper>

      <Pagination 
        page={page}
        totalPage={totalPage}
        onChange={setPage}
      />
    </>
  )
}

export default AdminReservationTab

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
`;

const TableWrapper = styled.div`
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

const InfoMain = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const InfoSub = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
  line-height: 1.3;
`;

const Menu = styled.div`
  max-width: 180px;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Price = styled.div`
  font-weight: 600;
  `;

const StatusWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const StatusBadge = styled.div`
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  width: fit-content;
`;

const PaymentBadge = styled(StatusBadge)``;

const CancelButton = styled.button<{disable?: boolean}>`
  padding: 5px 10px;
  font-size: 12px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  cursor: ${({disabled}) => disabled ? "not-allowed" : "pointer"};

  &:hover {
    background: #fca5a5;
    color: #b91c1c;
  }
`;

const Loading = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
`;

const EmptyText = styled(Loading)``;