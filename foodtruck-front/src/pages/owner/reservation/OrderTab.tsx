import { orderApi } from '@/apis/order/order.api';
import type { OwnerOrderListResponse } from '@/types/order/order.dto';
import { getErrorMsg } from '@/utils/error';
import { getOrderSource } from '@/utils/orderSource';
import { getOrderStatus } from '@/utils/orderStatus';
import { getPaymentStatus } from '@/utils/paymentStatus';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'

interface Props {
  scheduleId: number;
}

function OrderTab({scheduleId}: Props) {
  const [orders, setOrders] = useState<OwnerOrderListResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await orderApi.getTruckOrderList(scheduleId);
      setOrders(res);
    } catch (e) {
      alert(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(!scheduleId) return;

    fetchOrders();
  }, [scheduleId]);

  const handleCancel = async (id: number) => {
    try {
      await orderApi.cancelOrder(id);

      fetchOrders();
    } catch (e) {
      alert(getErrorMsg(e));
    }
  };

  const handleRefund = async (id: number) => {
    try {
      await orderApi.refundOrder(id);

      fetchOrders();
    } catch (e) {
      alert(getErrorMsg(e));
    }
  };

  if(loading) return <Loading>로딩 중...</Loading>
  if(orders.length === 0) return <EmptyText>주문 내역이 없습니다.</EmptyText>

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            <th style={{width: "8%"}}>주문 번호</th>
            <th style={{width: "10%"}}>주문 유형</th>
            <th style={{width: "12%"}}>주문자</th>
            <th style={{width: "20%"}}>메뉴</th>
            <th style={{width: "10%"}}>금액</th>
            <th style={{width: "8%"}}>주문 상태</th>
            <th style={{width: "8%"}}>결제 상태</th>
            <th style={{width: "17%"}}>주문일</th>
            <th style={{width: "7%"}}>관리</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => {
            const status = getOrderStatus(order.status);
            const paymentStatus = getPaymentStatus(order.paymentStatus);
            const menuItems = order.menus ?? [];

            const totalAmount = menuItems.reduce(
              (sum, item) => sum + item.unitPrice * item.qty,
              0
            );

            const totalQuantity = menuItems.reduce(
              (sum, item) => sum + item.qty,
              0
            );

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
                <td>{getOrderSource(order.source)}</td>
                <td>{order.username || "-"}</td>
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
                    {status.label}
                  </Status>
                </td>
                <td>
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td>
                  <ButtonWrapper>
                    {order.status === "PENDING" && (
                      <Button danger onClick={() => handleCancel(order.id)}>
                        취소
                      </Button>
                    )}

                    {order.status === "PAID" && (
                      <Button primary onClick={() => handleRefund(order.id)}>
                        환불
                      </Button>
                    )}
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

export default OrderTab

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