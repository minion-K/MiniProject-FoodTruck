import type { OwnerOrderListItemResponse } from '@/types/order/order.dto'
import styled from '@emotion/styled';
import React from 'react'

interface Props {
  order: OwnerOrderListItemResponse;
  onClose: () => void;
  onSelect: (type: "CARD" | "CASH") => void
}

function PaymentMethodModal({order, onClose, onSelect}: Props) {
  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>결제수단 선택</Title>

        <Summary>
          <AmountLabel>결제 금액</AmountLabel>
          <Amount>
            {order.amount.toLocaleString()}{order.currency}
          </Amount>
        </Summary>

        <ButtonRow>
          <Button onClick={() => onSelect("CARD")}>카드 결제</Button>
          <Button onClick={() => onSelect("CASH")}>현금 결제</Button>
        </ButtonRow>
        
        <CancelButton onClick={onClose}>
          취소
        </CancelButton>
      </Modal>
    </Overlay>
  )
}
export default PaymentMethodModal

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  padding: 32px;
  border-radius: 16px;
  width: 420px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
`;

const Summary = styled.div`
  background: #fff7eb;
  border: 1px solid #fed7aa;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
`;

const AmountLabel = styled.div`
  font-size: 13px;
  color: #6b7280;
`;

const Amount = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #ff6b00;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 6px;
`;

const Button = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;

  background: #fb923c;
  color: white;

  &:hover {
    opacity: 0.9;
  }
`;

const CancelButton = styled.button`
  border: none;
  background: #e5e7eb;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #d1d5db;
  }
`;