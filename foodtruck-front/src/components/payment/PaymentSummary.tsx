import { usePaymentContext } from "@/context/payment/PaymentContext";
import styled from "@emotion/styled";
import React from "react";

function PaymentSummary() {
  const { productName, amount, targetType } = usePaymentContext();

  return (
    <SummaryCard>
      <Title>결제 정보</Title>
      <Item>
        <Label>상품</Label>
        <Value>{productName}</Value>
      </Item>
      <Item>
        <Label>결제 대상</Label>
        <Value>{targetType}</Value>
      </Item>
      <Item>
        <Label>금액</Label>
        <Value>{amount.toLocaleString()} KRW</Value>
      </Item>
    </SummaryCard>
  );
}

export default PaymentSummary;

const SummaryCard = styled.div`
  padding: 20px;
  border-radius: 12px;
  background: #f8f9fa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const Label = styled.span`
  font-size: 14px;
  colr: #666;
`;

const Value = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #111;
`;
