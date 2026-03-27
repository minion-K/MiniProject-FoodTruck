import SearchInput from '@/components/common/SearchInput';
import styled from '@emotion/styled'
import React, { useMemo, useState } from 'react'

type UserTab = "USER" | "OWNER" | "ADMIN";
type StatusFilter = "ALL" | "ACTIVE" | "TMP";
type SortKey = "createdAt" | "email";

function AdminUserPage() {
  const [activeTab, setActiveTab] = useState<UserTab>("USER");
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [sortKey, setsortKey] = useState<SortKey>("createdAt");

  return (
    <Container>
      <HeaderRow>
        <Title>유저 관리</Title>
      </HeaderRow>

      <Tabs>
        <Tab 
          active={activeTab === "USER"} 
          onClick={() => setActiveTab("USER")}
        >
          일반 회원
        </Tab>
        <Tab 
          active={activeTab === "OWNER"} 
          onClick={() => setActiveTab("OWNER")}
        >
          트럭 운영자
        </Tab>
        <Tab 
          active={activeTab === "ADMIN"}
          onClick={() => setActiveTab("ADMIN")}
        >
          관리자
        </Tab>
      </Tabs>
      
      <FilterRow>
        <LeftWrapper>
          <Select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          >
            <option value="ALL">전체</option>
            <option value="ACTIVE">활성</option>
            <option value="TMP">정지</option>
          </Select>

          <Select
            value={sortKey}
            onChange={(e) => setsortKey(e.target.value as SortKey)}
          >
            <option value="createdAt">가입일순</option>
            <option value="이메일">이메일순</option>
          </Select>
        </LeftWrapper>
        
        <RightWrapper>
          <SearchInput 
            value={keyword}
            onChange={setKeyword}
            onSearch={() => {}}
          />
        </RightWrapper>
      </FilterRow>

      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>이메일</th>
              <th>휴대폰번호</th>
              <th>상태</th>
              <th>권한</th>
              <th>가입일</th>
              <th>관리</th>
            </tr>
          </thead>
        </StyledTable>
      </TableWrapper>
    </Container>
  )
}

export default AdminUserPage

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

const Tabs = styled.div`
  display: flex;
  gap: 10px;
`;

const Tab = styled.button<{active?: boolean}>`
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
  border: none;
  background: ${({active}) => active ? "#3b82f6" : "#f3f4f6"};
  color: ${({active}) => active ? "white" : "#374151"};
  cursor: pointer;

  &:hover {
    background: ${({active}) => active ? "#2563eb" : "#f3f4f6"}
  }
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