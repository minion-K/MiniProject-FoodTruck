import type { PaymentStatus } from "@/types/payment/payment.type";
import styled from "@emotion/styled";
import React from "react";

interface Props {
  status: string;
  onStatusChange: (status: string) => void;
}

function PaymentFilter({ status, onStatusChange }: Props) {
  return (
    <FilterWrapper>
      <select value={status} onChange={(e) => onStatusChange(e.target.value)}>
        <option value="ALL">전체</option>
        <option value="READY">결제 대기</option>
        <option value="SUCCESS">결제 완료</option>
        <option value="FAILED">결제 실패</option>
        <option value="CANCELLED_REFUNDED">결제 취소</option>
      </select>
    </FilterWrapper>
  );
}

export default PaymentFilter;

const FilterWrapper = styled.div`
  display: flex;
  gap: 8px;

  select {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #ddd;
    font-size: 14px;
  }
`;
