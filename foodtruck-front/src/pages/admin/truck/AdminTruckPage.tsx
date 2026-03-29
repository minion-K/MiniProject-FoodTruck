import SearchInput from '@/components/common/SearchInput';
import type { TruckStatus } from '@/types/truck/truck.type';
import { getTruckStatus } from '@/utils/TruckStatus';
import styled from '@emotion/styled';
import React, { useState } from 'react'

interface Truck {
  id: number;
  name: string;
  cuisine?: string;
  ownerId: number;
  status: TruckStatus;
  createdAt: string;
}

const mockTrucks: Truck[] = [
  {
    id: 1,
    name: "타코킹",
    cuisine: "멕시칸",
    ownerId: 2,
    status: "ACTIVE",
    createdAt: "2026-03-25",
  },
  {
    id: 2,
    name: "버거트럭",
    cuisine: "패스트푸드",
    ownerId: 5,
    status: "INACTIVE",
    createdAt: "2026-03-24",
  },
  {
    id: 3,
    name: "스시온휠",
    cuisine: "일식",
    ownerId: 7,
    status: "SUSPENDED", // 미래 대비
    createdAt: "2026-03-23",
  },
];

function AdminTruckPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [keyword, setKeyword] = useState("");

  const filtered = mockTrucks.filter((t) =>
    statusFilter ? t.status === statusFilter : true
  );

  return (
    <Container>
      <HeaderRow>
        <Title>트럭 관리</Title>
      </HeaderRow>

      <FilterRow>
        <LeftWrapper>
          <Select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">전체</option>
            <option value="ACTIVE">운영중</option>
            <option value="INACTIVE">운영중지</option>
            <option value="SUSPENDED">비활성화</option>
          </Select>
        </LeftWrapper>

        <RightWrapper>
          <SearchInput 
            value={keyword}
            onChange={setKeyword}
            onSearch={() => {}}
            placeholder="검색어를 입력하세요."
          />
        </RightWrapper>
      </FilterRow>

      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <th>ID</th>
              <th>트럭명</th>
              <th>음식</th>
              <th>운영자ID</th>
              <th>상태</th>
              <th>생성일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(truck => {
              const status = getTruckStatus(truck.status);

              return (
                <tr key={truck.id}>
                  <td>{truck.id}</td>
                  <td>{truck.name}</td>
                  <td>{truck.cuisine || "-"}</td>
                  <td>{truck.ownerId}</td>
                  <td>
                    <StatusBage style={{background: status.color}}>
                      {status.label}
                    </StatusBage>
                  </td>
                  <td>{truck.createdAt}</td>
                  <td>
                    {truck.status === "SUSPENDED" ? (
                      <ActionButton>정지 해제</ActionButton>
                    ) : (
                      <DangerButton>비활성화</DangerButton>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </StyledTable>
      </TableWrapper>
    </Container>
  )
}

export default AdminTruckPage

const Container = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
`;
const FilterRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const LeftWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const RightWrapper = styled.div`
  width: 280px;
`;

const Select = styled.select`
  height: 36px;
  padding: 0px 10px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
`;


const TableWrapper = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow-x: auto;
  background: white;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
  table-layout: fixed;

  th, td {
    padding: 12px 16px;
    text-align: left;
    font-size: 14px;
    border-bottom: 1px solid #f1f1f1;
    white-space: nowrap;
  }

  th {
    background: #f3f4f6;
    font-weight: 600;
    font-size: 13px;
    color: #374151;
  }

  tbody tr:hover {
    background: #f9fafb;
  }
`;

const StatusBage = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  width: 90px;
  padding: 2px 6px;
  border-radius: 8px;
  text-align: center;
  white-space: nowrap;
`;

const ActionButton = styled.button`
  padding: 5px 10px;
  font-size: 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: #e0f2fe;
  color: #0284c7;
`;

const DangerButton = styled(ActionButton)`
  background: #fee2e2;
  color: #dc2626;
`;
