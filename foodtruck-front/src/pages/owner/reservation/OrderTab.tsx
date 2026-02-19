import styled from '@emotion/styled';
import React from 'react'

const sampleOrders = [
  { id: 1, name: "홍길동", orderTime: "12:00 PM", status: "예약확정됨", payment: "미결제", menu: "핫도그 x2, 음료 x1" },
  { id: 2, name: "김철수", orderTime: "12:30 PM", status: "예약확정됨", payment: "현장결제", menu: "버거 x1, 감자튀김 x2" },
];

interface Props {
  scheduleId: number;
}

function OrderTab({scheduleId}: Props) {
  return (
    <Table>
      <thead>
        <tr>
          <Th>주문자</Th>
          <Th>주문 시간</Th>
          <Th>상태</Th>
          <Th>결제</Th>
          <Th>액션</Th>
        </tr>
      </thead>
      <tbody>
        {sampleOrders.map(o => (
          <tr key={o.id}>
            <Td>{o.name}</Td>
            <Td>{o.orderTime}</Td>
            <Td>{o.status}</Td>
            <Td>{o.payment}</Td>
            <Td>
              <Button>처리완료</Button>
              <Button>환불</Button>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default OrderTab

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 10px;
  border-bottom: 2px solid #ccc;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #eee;
`;

const Button = styled.button<{danger?: boolean}>`
  margin-right: 6px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;

  background: ${({danger}) => danger ? "#ffdddd" : "#f5f5f5"};
  border: 1px solid #ddd;
`;
