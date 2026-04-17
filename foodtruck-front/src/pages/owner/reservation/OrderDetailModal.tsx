import { orderApi } from '@/apis/order/order.api';
import type { OrderDetailResponse, OwnerOrderListItemResponse } from '@/types/order/order.dto';
import { formatDateTime, toKstString } from '@/utils/date';
import { getErrorMsg } from '@/utils/error';
import { getOrderSource } from '@/utils/orderSource';
import { getOrderStatus } from '@/utils/orderStatus';
import { getPaymentStatus } from '@/utils/paymentStatus';
import OrderCreateModal from './OrderFormModal';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import type { MenuListItemResponse } from '@/types/menu/menu.dto';
import PaymentMethodModal from './PaymentMethodModal';
import { useNavigate } from 'react-router-dom';

interface Props {
  orderId: number;
  menus: MenuListItemResponse[];
  truckName: string;
  truckId: number | null;
  scheduleId: number | null;

  onClose: () => void;
  onUpdated?: () => void;
}

function OrderDetailModal({
  orderId, menus, truckName, truckId, scheduleId, onClose, onUpdated
}: Props) {
  const [detail, setDetail] = useState<OrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [editOrder, setEditOrder] = useState<OwnerOrderListItemResponse | null>(null);
  const [payOrder, setPayOrder] = useState<OwnerOrderListItemResponse | null>(null);
  const navigate = useNavigate();

  const fetchDetail = async () => {
    try {
      setLoading(true);

      const res = await orderApi.getOrderById(orderId);
      setDetail(res);
    } catch (e) {
      alert(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [orderId]);

    if(!detail) return null;

  const handleCancel = async (id: number) => {
      if(!window.confirm("주문을 취소하시겠습니까?")) return;
  
      try {
        await orderApi.cancelOrder(detail.id);
  
        toast.success("주문이 취소되었습니다.");
        onClose();
        onUpdated?.();
      } catch (e) {
        alert(getErrorMsg(e));
        onClose();
      }
    };
  
    const handleRefund = async (id: number) => {
      if(!window.confirm("환불하시겠습니까?")) return;
      try {
        await orderApi.refundOrder(detail.id);
  
        toast.success("성공적으로 환불되었습니다.");
        onClose();
        onUpdated?.();
      } catch (e) {
        alert(getErrorMsg(e));
        onClose();
      }
    };

  const orderStatus = getOrderStatus(detail.status);
  const orderSource = getOrderSource(detail.source);
  const paymentStatus = getPaymentStatus(detail.paymentStatus);

  const canEdit = detail.status === "PENDING";
  const canCancel = detail.status === "PENDING";
  const canPay = detail.paymentStatus === "READY" && detail.status === "PENDING";
  const canRefund = detail.paymentStatus === "SUCCESS" && detail.status === "PAID";

  if(loading) return <Modal>로딩 중...</Modal>

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>주문 상세</Title>
        
        <Divider />

        <Row>
          <Label>주문자</Label>
          <Value>{detail.username || "비회원"}</Value>
        </Row>

        <Row>
          <Label>주문 시간</Label>
          <Value>{formatDateTime(detail.createdAt)}</Value>
        </Row>

        <Row>
          <Label>주문 유형</Label>
          <Value>{orderSource.label}</Value>
        </Row>

        <Row>
          <Label>주문 상태</Label>
          <Status style={{background: orderStatus.color}}>
            {orderStatus.label}
          </Status>
        </Row>

        <Row>
          <Label>결제 상태</Label>
          <Status style={{background: paymentStatus.color}}>
            {paymentStatus.label}
          </Status>
        </Row>

        <Row>
          <Label>금액</Label>
          <Value>{detail.amount} {detail.currency}</Value>
        </Row>

        <MenuSection>
          <Label style={{marginBottom: 6}}>메뉴</Label>
          {detail.menus?.map(item => (
            <MenuItem key={item.menuItemId}>
              <span>{item.menuItemName} {item.qty}개</span>
            </MenuItem>
          ))}
        </MenuSection>
        <MenuSection>
          <Label style={{marginBottom: 6}}>요청 사항</Label>
          <Value style={{fontSize: 13}}>{detail.note ? detail.note : "-"}</Value>
        </MenuSection>

        <Actions>
          <Button
            disabled={!canEdit}
            onClick={() => setEditOrder(detail as any)}
          >
            수정
          </Button>
          <Button
            danger
            disabled={!canCancel}
            onClick={() => handleCancel(detail.id)}
          >
            취소
          </Button>

          <Button
            primary
            disabled={canPay && canRefund}
            onClick={() => {
              if(canPay) return setPayOrder(detail as any);
              if(canRefund) return handleRefund(detail.id);
            }}
          >
            {canPay ? "결제" : canRefund ? "환불" :"결제"}
          </Button>
        </Actions>

        <CloseButton onClick={onClose}>X 닫기</CloseButton>

        {editOrder && (
          <OrderCreateModal 
            open={true}
            scheduleId={detail.scheduleId}
            menus={menus}
            initialOrder={editOrder}
            onClose={() => setEditOrder(null)}
            onSuccess={() => {
              fetchDetail();
              onUpdated?.();
              setEditOrder(null);
              onClose();
            }}
          />
        )}

        {payOrder && (
          <PaymentMethodModal 
            order={payOrder}
            onClose={() => setPayOrder(null)}
            onSelect={onsiteType => {
              navigate("/pay/onsite", {
              state: {
                order: payOrder,
                productName: truckName,
                amount: payOrder.amount,
                targetType: "ONSITE",
                onsiteType: onsiteType,

                selectedTruckId: truckId,
                selectedScheduleId: scheduleId,
                activeTab: "order",

                displayInfo: {
                  menus: payOrder.menus?.map(menu => ({
                    name: menu.menuItemName,
                    quantity: menu.qty
                  }))
                }
              }
            });

          setPayOrder(null);
        }}
          />
        )}
      </Modal>
    </Overlay>
  )
}

export default OrderDetailModal

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
  position: relative;
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
  position: absolute;
  top: 25px;
  right: 15px;
  padding: 4px 8px;
  border-radius: 8px;
  border: none;
  background: transparent;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
    border-radius: 4px;
  }
`;

