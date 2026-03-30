import SearchInput from '@/components/common/SearchInput';
import styled from '@emotion/styled';
import React, { useState } from 'react'
import AdminReservationTab from './AdminReservationTab';
import AdminOrderTab from './AdminOrderTab';
import type { ReservationStatus } from '@/types/reservation/reservation.type';
import type { OrderStatus } from '@/types/order/order.type';

type ReservationTab = "RESERVATION" | "ORDER";
type FilterDate = "ALL" | "TODAY" | "WEEK" | "MONTH"

function AdminReservationPage() {
  const [activeTab, setActiveTab] = useState<ReservationTab>("RESERVATION");
  const [dateRange, setDateRange] = useState<FilterDate>("ALL");
  const [reservationStatus, setReservationStatus] = useState<"ALL" | ReservationStatus>("ALL");
  const [orderStatus, setOrderStatus] = useState<"ALL" | OrderStatus>("ALL");
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <Container>
      <HeaderRow>
        <Title>예약 · 주문관리</Title>
      </HeaderRow>

      <Tabs>
        <Tab 
          active={activeTab === "RESERVATION"}
          onClick={() => setActiveTab("RESERVATION")}
        >
          예약
        </Tab>
        <Tab 
          active={activeTab === "ORDER"} 
          onClick={() => setActiveTab("ORDER")}
        >
          주문
        </Tab>
      </Tabs>

      <FilterRow>
        <LeftWrapper>
          <DateSelect 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value as FilterDate)}
          >
            <option value="ALL">전체</option>
            <option value="TODAY">오늘</option>
            <option value="WEEK">이번 주</option>
            <option value="MONTH">이번 달</option>
          </DateSelect>

          {activeTab === "RESERVATION" ? (
            <ReservationStatusSelect
              value={reservationStatus}
              onChange={(e) => setReservationStatus(e.target.value as ReservationStatus)}
            >
              <option value="ALL">전체</option>
              <option value="PENDING">대기</option>
              <option value="CONFIRMED">확정</option>
              <option value="CANCELED">취소</option>
            </ReservationStatusSelect>
          ) : (
            <OrderStatusSelect
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
            >
              <option value="ALL">전체</option>
              <option value="ALL">대기</option>
              <option value="ALL">확정</option>
              <option value="ALL">취소</option>
            </OrderStatusSelect>
          )}
        </LeftWrapper>
        
        <RightWrapper>
          <SearchInput 
            value={keyword}
            onChange={setKeyword}
            onSearch={() => {setSearchKeyword(keyword)}}
            placeholder="트럭명으로 검색해주세요."
          />
        </RightWrapper>
      </FilterRow>

      {activeTab === "RESERVATION" && (
        <AdminReservationTab  
          keyword={searchKeyword} 
          dateRange={dateRange}
          status={reservationStatus}
        />
      )}

      {activeTab === "ORDER" && (
        <AdminOrderTab  
          keyword={searchKeyword}
          dateRange={dateRange}
          status={orderStatus}
        />
      )}
    </Container>
  )
}

export default AdminReservationPage

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

const DateSelect = styled.select`
  height: 36px;
  padding: 0px 10px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
`;

const ReservationStatusSelect = styled(DateSelect)``;

const OrderStatusSelect = styled(DateSelect)``;