import type { ReservationStatus } from '@/types/reservation/reservation.type';
import styled from '@emotion/styled';
import React from 'react'

interface Props {
  status: string;
  onStatusChange: (status: ReservationStatus | "ALL") => void;
}

function ReservationFilter({status, onStatusChange}: Props) {
  return (
    <FilterWrapper>
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as ReservationStatus | "ALL")}
      >
        <option value="ALL">전체</option>
        <option value="PENDING">예약완료</option>
        <option value="CONFIRMED">주문완료</option>
        <option value="CANCELED">예약취소</option>
      </select>

    </FilterWrapper>
  )
}

export default ReservationFilter

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