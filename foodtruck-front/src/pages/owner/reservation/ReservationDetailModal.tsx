import styled from '@emotion/styled';
import React from 'react'

interface Props {
  data: any;
  onClose: () => void;
}

function ReservationDetailModal({data, onClose}: Props) {
  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <h3>예약 상세</h3>
        <p>예약자: {data.name}</p>
        <p>예약 시간: {data.time}</p>
        <p>상태: {data.status}</p>
        <p>결제 상태: {data.payment}</p>
        <p>메뉴: {data.menu}</p>
        <CloseButton onClick={onClose}>닫기</CloseButton>
      </Modal>
    </Overlay>
  )
}

export default ReservationDetailModal

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 400px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  transform: translate(-50%, -50%);
`;

const CloseButton = styled.button`
  margin-top: 12px;
`;