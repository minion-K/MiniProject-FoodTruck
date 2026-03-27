import type { OrderStatus } from '@/types/order/order.type';
import styled from '@emotion/styled';
import React from 'react'

interface Props {
  keyword: string;
  dateRange: "ALL" | "TODAY" | "WEEK" | "MONTH";
  status: OrderStatus;
}

function AdminOrderTab({keyword, dateRange, status}: Props) {
  return (
    <>
      <HeaderRow>
        <Title>주문 관리</Title>
      </HeaderRow>

      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <th>주문정보</th>
              <th>메뉴</th>
              <th>금액</th>
              <th>상태</th>
              <th>주문일</th>
              <th>액션</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                <InfoMain>김밥트럭</InfoMain>
                <InfoSub>12:00~14:00</InfoSub>
                <InfoSub>주문유형 · 홍길동</InfoSub>
              </td>
              <td>
                <Menu>불고기 버거 외2개</Menu>
              </td>
              <td>
                <Price>23000 KRW</Price>
              </td>
              <td>
                <StatusWrapper>
                  <StatusBadge>COMFIRM</StatusBadge>
                  <PaymentBadge>PAID</PaymentBadge>
                </StatusWrapper>
              </td>
              <td>2026-03-27</td>
              <td>
                <ActionButton>상세</ActionButton>
              </td>
            </tr>
          </tbody>
        </StyledTable>
      </TableWrapper>
    </>
  )
}

export default AdminOrderTab

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
  gap: 4px;
`;

const StatusBadge = styled.div`
  font-size: 11px;
  padding: 2px 6px;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 4px;
  width: fit-content;
`;

const PaymentBadge = styled.div`
  font-size: 11px;
  padding: 2px 6px;
  background: #dcfce7;
  color: #166534;
  border-radius: 4px;
  width: fit-content;
`;

const ActionButton = styled.button`
  padding: 5px 10px;
  font-size: 12px;
  border: none;
  background: #111827;
  color: white;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #374151;
  }
`;