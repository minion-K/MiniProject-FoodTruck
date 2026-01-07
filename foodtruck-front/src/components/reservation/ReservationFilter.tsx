import styled from '@emotion/styled';
import React from 'react'

interface Props {
  status: string;
  onStatusChange: (status: string) => void;
}

function ReservationFilter({status, onStatusChange}: Props) {
  return (
    <FilterWrapper>
      <select
        value={status}
        onChange={e => onStatusChange(e.target.value)}
      >
        <option value="ALL">전체</option>
        <option value="PENDING">PENDING</option>
        <option value="CONFIRMED">CONFIRMED</option>
        <option value="CANCELED">CANCELED</option>
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