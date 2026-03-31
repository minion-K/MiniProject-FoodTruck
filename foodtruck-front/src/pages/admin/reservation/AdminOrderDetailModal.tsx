import { orderApi } from '@/apis/order/order.api';
import type { AdminOrderListItemResponse } from '@/types/order/order.dto';
import { getErrorMsg } from '@/utils/error';
import { getOrderStatus } from '@/utils/orderStatus';
import { getPaymentStatus } from '@/utils/paymentStatus';
import styled from '@emotion/styled';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

interface Props {
  open: boolean;
  order: AdminOrderListItemResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

function AdminOrderDetailModal({open, order, onClose, onSuccess}: Props) {
  const [loading, setLoading] = useState(false);

  if (!open || !order) return null;

  const canCancel = order.status === "PENDING";
  const canRefund = order.paymentStatus === "SUCCESS" && order.status === "PAID";

  const handleCancel = async () => {
    if(!window.confirm("해당 주문을 취소하시겠습니까?")) return ;

    try {
      setLoading(true);

      await orderApi.cancelOrder(order.id);

      toast.success("주문이 취소되었습니다.")
      onSuccess();
      onClose();
    } catch (e) {
      alert(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    if(!window.confirm("해당 주문을 환불하시겠습니까?")) return ;

    try {
      setLoading(true);

      await orderApi.refundOrder(order.id);

      toast.success("주문이 환불되었습니다.")
      onSuccess();
      onClose();
    } catch (e) {
      alert(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  }

  const orderStatus = getOrderStatus(order.status);
  const paymentStatus = getPaymentStatus(order.paymentStatus);

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>주문 상세</Title>

        <Divider />

        <Row>
          <Label>트럭</Label>
          <Value>{order.truckName}</Value>
        </Row>
        <Row>
          <Label>주문자</Label>
          <Value>{order.username}</Value>
        </Row>
        <MenuSection>
          <SectionTitle>메뉴</SectionTitle>
          {order.items.map(item => (
            <MenuItem key={item.menuItemId}>
              <span>{item.menuItemName}</span>
              <span>{item.qty}개</span>
            </MenuItem>
          ))}
        </MenuSection>
        <Row>
          <Label>금액</Label>
          <Value>{order.amount} {order.currency}</Value>
        </Row>
        <Row>
          <Label>주문 상태</Label>
          <Status  style={{background: orderStatus.color}}>
            {orderStatus.label}
          </Status>
        </Row>
        <Row>
          <Label>결제 상태</Label>
          <Status  style={{background: paymentStatus.color}}>
            {paymentStatus.label}
          </Status>
        </Row>
        <ButtonRow>
          {canCancel && (
            <Button danger disabled={loading} onClick={handleCancel}>
              결제취소
            </Button>
          )}
          {canRefund && (
            <Button primary disabled={loading} onClick={handleRefund}>
              환불
            </Button>
          )}
        </ButtonRow>
        <CloseButton onClick={onClose}>X 닫기</CloseButton>
      </Modal>
    </Overlay>
  )
}


export default AdminOrderDetailModal

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

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
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