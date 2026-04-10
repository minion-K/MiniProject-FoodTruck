import { orderApi } from '@/apis/order/order.api';
import Pagination from '@/components/common/Pagination';
import type { AdminOrderListItemResponse, OrderDetailResponse } from '@/types/order/order.dto';
import type { OrderSource, OrderStatus } from '@/types/order/order.type';
import { formatDateTime } from '@/utils/date';
import { getErrorMsg } from '@/utils/error';
import { getOrderSource } from '@/utils/orderSource';
import { getOrderStatus } from '@/utils/orderStatus';
import { getPaymentStatus } from '@/utils/paymentStatus';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'
import AdminOrderDetailModal from './AdminOrderDetailModal';

interface Props {
  keyword: string;
  dateRange: "ALL" | "TODAY" | "WEEK" | "MONTH";
  status: "ALL" | OrderStatus;
  source : "ALL" | OrderSource;
}

function AdminOrderTab({keyword, dateRange, status, source}: Props) {
  const [orders, setOrders] = useState<AdminOrderListItemResponse[]>([]);
  const [page, setPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderListItemResponse | null>(null);
  const [open, setOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const res = await orderApi.getAdminOrderList({
        page,
        size: 10,
        keyword: keyword || undefined,
        dateRange,
        status: status === "ALL" ? undefined : status,
        source: source === "ALL" ? undefined : source
      });

      setOrders(res.content);
      setTotalPage(res.totalPage);
    } catch (e) {
      alert(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setPage(0);
  }, [status, keyword, dateRange, source]);

  useEffect(() => {
    fetchOrders()
  }, [page, status, keyword, dateRange, source])

  return (
    <>
      <HeaderRow>
        <Title>주문 관리</Title>
      </HeaderRow>

      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <th style={{width: "18%"}}>주문정보</th>
              <th style={{width: "15%"}}>메뉴</th>
              <th style={{width: "15%"}}>금액</th>
              <th style={{width: "15%"}}>상태</th>
              <th style={{width: "20%"}}>주문일</th>
              <th style={{width: "15%"}}>액션</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>
                  <Loading>로딩 중 ...</Loading>
                </td>
              </tr>
            ) : (
              orders.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyText>조회된 주문이 없습니다.</EmptyText>
                </td>
              </tr>
            ) : (
              orders.map(order => {
                const orderStatus = getOrderStatus(order.status);
                const paymentStatus = getPaymentStatus(order.paymentStatus);
                const orderSource = getOrderSource(order.source);
                const menuItems = order.items ?? [];
              
                const menuSummary = menuItems.length === 0
                  ? "메뉴 정보 없음"
                  : menuItems.length === 1
                  ? `${menuItems[0].menuItemName} ${menuItems[0].qty}개`
                  : `${menuItems[0].menuItemName} ${menuItems[0].qty}개 외 ${menuItems.length - 1}건`

                const menuText = menuItems.length === 0
                  ? "메뉴 정보 없음"
                  : menuItems
                    .map(item => `${item.menuItemName} ${item.qty}개`)
                    .join(", ");
                return (
                  <tr  key={order.id}>
                    <td>
                      <InfoBox>
                        <TopRow>
                          <TruckName>
                            {order.truckName}
                          </TruckName>
                          <OrderType style={{background: orderSource.color}}>
                            {orderSource.label}
                          </OrderType>
                        </TopRow>
                        <DateRow>
                          {formatDateTime(order.startTime, "date")}
                        </DateRow>
                        <TimeRow>
                          {formatDateTime(order.startTime, "time")} - {formatDateTime(order.endTime, "time")}
                        </TimeRow>
                        <UserRow>
                          {order.username}
                        </UserRow>
                      </InfoBox>
                    </td>
                    <td>
                      <Menu title={menuText}>
                        {menuSummary}
                      </Menu>
                    </td>
                    <td>
                      <Price>{order.amount.toLocaleString()} {order.currency}</Price>
                    </td>
                    <td>
                      <StatusWrapper>
                        <StatusBadge style={{background: orderStatus.color}}>
                          {orderStatus.label}
                        </StatusBadge>
                        <PaymentBadge style={{background: paymentStatus.color}}>
                          {paymentStatus.label}
                        </PaymentBadge>
                      </StatusWrapper>
                    </td>
                    <td>{formatDateTime(order.createdAt)}</td>
                    <td>
                      <ActionButton
                        onClick={() => {
                          setSelectedOrder(order);
                          setOpen(true);
                        }}
                      >
                        상세보기
                      </ActionButton>
                    </td>
                  </tr>
                )
              })
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>
      
      <Pagination 
        page={page}
        totalPage={totalPage}
        onChange={setPage}
      />

      <AdminOrderDetailModal
        open={open}
        order={selectedOrder}
        onClose={() => setOpen(false)}
        onSuccess={fetchOrders}
      />
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

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TruckName = styled.div`
  font-weight: 600;
`;

const OrderType = styled.div`
  font-size: 11px;
  padding: 2px 6px;
  background: #e5e7eb;
  border-radius: 4px;
`;

const DateRow = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const TimeRow = styled.div`
  font-size: 12px;
  font-weight: 500;
`;

const UserRow = styled.div`
  font-size: 12px;
  color: #9ca3af;
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