import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import ScheduleStatisticsModal from "./ScheduleStatisticsModal";
import type { DashboardResponse, RefundResponse, ScheduleSalesResponse, TopMenuResponse, WeeklySalesResponse } from "@/types/statistics/statistics.dto";
import { statisticsApi } from "@/apis/statistics/statistics.api";
import { getErrorMsg } from "@/utils/error";
import { formatDateTime } from "@/utils/date";
import { truckApi } from "@/apis/truck/truck.api";
import type { TruckListItemResponse } from "@/types/truck/truck.dto";

interface ScheduleItem {
  id: number;
  location: string;
  time: string;
  sales: number;
}

function OwnerStatisticspage() {
  const [selectedSchdule, setSelectedSchedule] = useState<ScheduleItem | null>(null);

  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [weeklySales, setWeeklySales] = useState<WeeklySalesResponse[]>([]);
  const [topMenus, setTopMenus] = useState<TopMenuResponse[]>([]);
  const [scheduleSales, setScheduleSales] = useState<ScheduleSalesResponse[]>([]);
  const [refundCount, setRefundCount] = useState<RefundResponse | null>(null);

  const [truckList, setTruckList] = useState<TruckListItemResponse[]>([]);
  const [selectedTruckId, setSelectedTruckId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const trucks = await truckApi.getOwnerTruckList();
        setTruckList(trucks);
      } catch (e) {
        alert(getErrorMsg(e));
      }
    };

    fetchTrucks();
  }, []);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const dashboardResponse = await statisticsApi.getDashboard(
          selectedTruckId ?? undefined
        );
        setDashboard(dashboardResponse);

        const weeklySalesResponse = await statisticsApi.getWeeklySales(
          selectedTruckId ?? undefined
        );
        setWeeklySales(weeklySalesResponse);

        const topMenusResponse = await statisticsApi.getTopMenus(
          selectedTruckId ?? undefined
        );
        setTopMenus(topMenusResponse);

        const scheduleResponse = await statisticsApi.getSchedules(
          selectedTruckId ?? undefined
        );
        setScheduleSales(scheduleResponse);

        const refundResponse = await statisticsApi.getRefundCount(
          selectedTruckId ?? undefined
        );
        setRefundCount(refundResponse);
      } catch(e) {
        alert(getErrorMsg(e));
      }
    };

    

    fetchStatistics();
  }, [selectedTruckId]);

  

  return (
    <Container>
      <Header>
        <Title>통계 대시보드</Title>
      </Header>

      <HeaderRight>
        <TruckSelect 
          value={selectedTruckId ?? ""}
          onChange={
            e => setSelectedTruckId(e.target.value 
              ? Number(e.target.value) 
              : null)}
        >
          <option value="">전체</option>
          {truckList.map(truck => (
            <option
              key={truck.id}
              value={truck.id}
            >
              {truck.name}
            </option>
          ))}
          
        </TruckSelect>
        
        <PeriodTabs>
          <PeriodButton active>오늘</PeriodButton>
          <PeriodButton>이번 주</PeriodButton>
          <PeriodButton>이번 달</PeriodButton>
        </PeriodTabs>
      </HeaderRight>


      <CardGrid>
        <StatCard>
          <span>오늘 매출</span>
          <strong>{dashboard?.todaySales?.toLocaleString() ?? 0}KRW</strong>
        </StatCard>

        <StatCard>
          <span>총 주문</span>
          <strong>{dashboard?.todayOrders ?? 0}</strong>
        </StatCard>

        <StatCard>
          <span>예약 수</span>
          <strong>{dashboard?.todayReservations ?? 0}</strong>
        </StatCard>

        <StatCard>
          <span>환불</span>
          <strong>{refundCount?.refundCount ?? 0}</strong>
        </StatCard>
      </CardGrid>
      
      <Row>
        <ChartCard>
          <CardTitle>주간 매출 현황</CardTitle>
          <ChartPlaceholder>그래프 영역</ChartPlaceholder>
        </ChartCard>

        <MenuCard>
          <CardTitle>인기 메뉴 TOP 5</CardTitle>
          <MenuList>
            {topMenus.map((menu, idx) => (
              <li key={idx}>
                {idx + 1}. {menu.menuName}
                <span>{menu.totalQty}</span>
              </li>
            ))}
          </MenuList>
        </MenuCard>
      </Row>

      <Row>
        <ScheduleCard>
          <CardTitle>오늘 스케줄 매출</CardTitle>

          {scheduleSales.map(schedule => (
            <ScheduleItemWrapper
              key={schedule.scheduleId}
              onClick={() => setSelectedSchedule({
                id: schedule.scheduleId,
                location: schedule.locationName,
                time: formatDateTime(schedule.startTime),
                sales: schedule.sales
              })}
            >
              <div>
                <strong>{schedule.locationName}</strong>
                <span>{formatDateTime(schedule.startTime)}</span>
              </div>

              <Sales>{schedule.sales.toLocaleString()} KRW</Sales>
            </ScheduleItemWrapper>
          ))}
        </ScheduleCard>

        <OrderTypeCard>
          <CardTitle>주문 유형</CardTitle>
          <PiePlaceholder>파이 차트 영역</PiePlaceholder>
        </OrderTypeCard>
      </Row>

      {selectedSchdule && (
        <ScheduleStatisticsModal 
          schedule={selectedSchdule}
          onClose={() => setSelectedSchedule(null)}
        />
      )}
    </Container>
  );
}

export default OwnerStatisticspage;

const Container = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const TruckSelect = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: white;
`;

const PeriodTabs = styled.div`
  display: flex;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`;

const PeriodButton = styled.button<{active?: boolean}>`
  padding: 8px 16px;
  border: none;
  background: ${({active}) => active ? "#3b82f6" : "white"};
  color: ${({active}) => active ? "white" : "#374151"};
  cursor: pointer;

  &:hover {
    background: ${({active}) => active ? "#2563eb" : "#f3f4f6"}
  }
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

const StatCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;

  span {
    color: #6b7280;
  }

  strong {
    font-size: 22px;
    display: block;
    margin-top: 6px;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
`;

const ChartCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
`;

const ChartPlaceholder = styled.div`
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
`;

const MenuCard = styled(ChartCard)``;

const CardTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 12px;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;

  li {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
  }
`;

const ScheduleCard = styled(ChartCard)``;

const ScheduleItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
  }

  div {
    display: flex;
    flex-direction: column;
  }

  span {
    font-size: 12px;
    color: #6b7280;
  }
`;

const Sales = styled.div`
  font-weight: 600;
`;

const OrderTypeCard = styled(ChartCard)``;

const PiePlaceholder = styled(ChartPlaceholder)``;