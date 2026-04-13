import { orderApi } from '@/apis/order/order.api';
import type { OwnerOrderListItemResponse } from '@/types/order/order.dto';
import { getErrorMsg } from '@/utils/error';
import { getOrderSource } from '@/utils/orderSource';
import { getOrderStatus } from '@/utils/orderStatus';
import { getPaymentStatus } from '@/utils/paymentStatus';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'
import Pagination from '@/components/common/Pagination';

interface Props {
  scheduleId: number;
  onSelect: (id: number) => void;
}

function OrderTab({scheduleId, onSelect}: Props) {
  const [orders, setOrders] = useState<OwnerOrderListItemResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await orderApi.getOwnerOrderList({
        page,
        size: 10,
        scheduleId
      },
      )
      setOrders(res.content);
      setTotalPage(res.totalPage);
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

    fetchOrders();
  }, [scheduleId, page]);

  if(loading) return <Loading>로딩 중...</Loading>

  return (
    <>
      <Header>
        <Title>주문 관리</Title>
        <Button primary onClick={() => setCreateOpen(true)}>
          주문 등록
        </Button>
      </Header>

      {orders.length === 0 ? (
        <EmptyText>주문 내역이 없습니다.</EmptyText>
      ) : (
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th style={{width: "10%"}}>주문 번호</th>
                <th style={{width: "12%"}}>주문 유형</th>
                <th style={{width: "12%"}}>주문자</th>
                <th style={{width: "20%"}}>메뉴</th>
                <th style={{width: "15%"}}>금액</th>
                <th style={{width: "15%"}}>주문 상태</th>
                <th style={{width: "15%"}}>결제 상태</th>
                <th style={{width: "27%"}}>주문일</th>
                <th style={{width: "25%"}}>관리</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const status = getOrderStatus(order.status);
                const paymentStatus = getPaymentStatus(order.paymentStatus);
                const orderSource = getOrderSource(order.source);
                const menuItems = order.menus ?? [];

                const menuSummary = menuItems.length === 0
                  ? "메뉴 정보 없음"
                  : menuItems.length === 1
                  ? `${menuItems[0].menuItemName} ${menuItems[0].qty}개`
                  : `${menuItems[0].menuItemName} 외 ${menuItems.length - 1}건`

                const menuText = menuItems.length === 0
                  ? "메뉴 정보 없음"
                  : menuItems
                    .map(item => `${item.menuItemName} ${item.qty}개`)
                    .join(", ");

                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{orderSource.label}</td>
                    <td>{order.username}</td>
                    <td title={menuText}>{menuSummary}</td>
                    <td>
                      {order.amount.toLocaleString()}{order.currency}
                    </td>
                    <td>
                      <Status style={{background: status.color}}>
                        {status.label}
                      </Status>
                    </td>
                    <td>
                      <Status style={{background: paymentStatus.color}}>
                        {paymentStatus.label}
                      </Status>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <ButtonWrapper>
                        <Button onClick={() => onSelect(order.id)}>
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

export default OrderTab

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
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
    text-align: center;
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
  flex-wrap: nowrap;
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