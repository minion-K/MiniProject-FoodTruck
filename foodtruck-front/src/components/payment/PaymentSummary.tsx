import { usePaymentContext } from "@/context/payment/PaymentContext";
import { formatPickupRange, formatTime } from "@/utils/date";
import styled from "@emotion/styled";
import React from "react";

function PaymentSummary() {
  const { productName, amount, targetType, displayInfo } = usePaymentContext();

  return (
    <SummaryCard>
      <Title>결제 정보</Title>
      <Item>
        <Label>트럭</Label>
        <Value>{productName}</Value>
      </Item>
      <Item>
        <Label>결제 유형</Label>
        <Value>
          {targetType === "RESERVATION" ? "예약 결제" : "현장 결제"}
        </Value>
      </Item>

      {displayInfo?.pickupTime && (
        <Item>
          <Label>픽업 시간</Label>
          <Value>{formatPickupRange(displayInfo.pickupTime)}</Value>
        </Item>
      )}

      {displayInfo?.menus && (
        <Item>
          <Label>메뉴</Label>
          <MenuList>
            {displayInfo.menus.map((menu) => (
              <MenuItem key={menu.name}>
                {menu.name} X {menu.quantity}
              </MenuItem>
            ))}
          </MenuList>
        </Item>
      )}
      <Divider />

      <Item highlight>
        <Label>금액</Label>
        <Value strong>{amount.toLocaleString()} KRW</Value>
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
  text-align: center;
  margin-bottom: 16px;
  color: #333;
`;

const Item = styled.div<{ highlight?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ highlight }) => (highlight ? "16px" : "14px")};
`;

const Label = styled.span`
  font-size: 14px;
  color: #666;
`;

const Value = styled.span<{ strong?: boolean }>`
  font-size: ${({ strong }) => (strong ? "18px" : "16px")};
  font-weight: ${({ strong }) => (strong ? 700 : 500)};
  color: #111;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: right;
  max-width: 60%;
`;

const MenuItem = styled.div`
  font-size: 14px;
  color: #333;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.05);
  margin: 12px 0;
`;
