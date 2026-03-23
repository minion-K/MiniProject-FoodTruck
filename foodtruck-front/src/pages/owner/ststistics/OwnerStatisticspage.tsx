import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import ScheduleStatisticsModal from "./ScheduleStatisticsModal";
import type { DashboardResponse, OrderTypeResponse, RefundResponse, ScheduleSalesResponse, TopMenuResponse, WeeklySalesResponse } from "@/types/statistics/statistics.dto";
import { statisticsApi } from "@/apis/statistics/statistics.api";
import { getErrorMsg } from "@/utils/error";
import { formatDateTime } from "@/utils/date";
import { truckApi } from "@/apis/truck/truck.api";
import type { TruckListItemResponse } from "@/types/truck/truck.dto";
import { CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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
  const [orderTypes, setOrderTypes] = useState<OrderTypeResponse[]>([]);

  const [truckList, setTruckList] = useState<TruckListItemResponse[]>([]);
  const [selectedTruckId, setSelectedTruckId] = useState<number | null>(null);
  const [schedulePage, setSchedulePage] = useState(0);
  const [scheduleHasMore, setScheduleHasMore] = useState(true);
  const schedulePageSize = 10;

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

  const fetchSchedules = async(page: number) => {
      try {
        const schedules = await statisticsApi.getSchedules(
          selectedTruckId ?? undefined,
          page,
          schedulePageSize
        );
        
        if(page === 0) {
          setScheduleSales(schedules.content ?? []);
        } else {
          setScheduleSales(prev => [...prev, ...schedules.content ?? []]);
        }

        setSchedulePage(schedules.page ?? page);
        setScheduleHasMore((schedules.content?.length ?? 0) === schedulePageSize);
      } catch (e) {
        alert(getErrorMsg(e));
      }
    };

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

        await fetchSchedules(0);

        const refundResponse = await statisticsApi.getRefundCount(
          selectedTruckId ?? undefined
        );
        setRefundCount(refundResponse);

        const orderTypeResponse = await statisticsApi.getOrderTypes(
          selectedTruckId ?? undefined
        );
        setOrderTypes(orderTypeResponse);
      } catch(e) {
        alert(getErrorMsg(e));
      }
    };

    

    fetchStatistics();
  }, [selectedTruckId]);

  const orderTypesWithColor = orderTypes.map(item => ({
    ...item,
    count: Number (item.count),
    fill: item.type === "RESERVATION" ? "#3b82f6" : "#f97316"
  }))

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
          <strong>{dashboard?.todaySales?.toLocaleString() ?? 0} KRW</strong>
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
          
          <ResponsiveContainer width="100%" height={250}>
            <LineChart 
              data={weeklySales}
              margin={{top: 10, right: 10, left: 0, bottom: 0}}
            >
              <CartesianGrid 
                strokeDasharray="3 3"
                stroke="#eee"
              />
              <XAxis 
                dataKey="date"
                padding={{left: 10}}
                tick={{fontSize: 14}}
                tickMargin={5}
                tickFormatter={value => {
                  const d = new Date(value);
                  const month = d.getMonth() + 1;
                  const date = d.getDate();
                  const days = ["일", "월", "화", "수", "목", "금", "토"]

                  return `${month}-${date} (${days[d.getDay()]})`;
                }}
              />
              <YAxis 
                width={60}
                tickCount={5}
                tickMargin={10}
                domain={[
                  (min: number) => min * 0.9,
                  (max: number) => max * 1.1
                ]}
                tick={({x, y, payload, index}) => {
                  if(index === 0) return null;

                  return (
                    <text 
                      x={x}
                      y={y} 
                      dy={6}
                      textAnchor="end" 
                      fill="#666" 
                      fontSize={14}
                    >
                      {`${Math.round(payload.value / 10000)}만`}
                    </text>
                  )
                }}
              />
              <Tooltip 
                cursor={{strokeDasharray: "3 3"}}
                formatter={value => `${Number (value).toLocaleString()} KRW`}
                labelFormatter={value => {
                  const d = new Date(value);
                  const days = ["일", "월", "화", "수", "목", "금", "토"]

                  return `날짜: ${d.getMonth() + 1}-${d.getDate()} (${days[d.getDay()]})`
                }}
              />
              <Line 
                type="monotone"
                dataKey="sales"
                name="금액"
                strokeWidth={1.3}
                dot={false}
                activeDot={{r: 6}}
              />
            </LineChart>
          </ResponsiveContainer>
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

          {scheduleHasMore && (
            <LoadMoreButton onClick={() => fetchSchedules(schedulePage + 1)}>
              더보기
            </LoadMoreButton>
          )}
        </ScheduleCard>

        <OrderTypeCard>
          <CardTitle>주문 유형</CardTitle>
          
          {orderTypes.length === 0 ? (
            <PiePlaceholder>데이터 없음</PiePlaceholder>
          ) : (
            <ChartWrapper>
              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <PieChart>
                  <Pie
                    data={orderTypesWithColor}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    labelLine={false}
                    label={({payload, percent}) => {
                      const labelText = payload === "RESERVATION" ? "예약 주문" : "현장 주문";
                      return `${labelText} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    }
                  />
                  <Tooltip 
                    formatter={(value, name, props) => {
                      const type = (props?.payload as {type?: string})?.type;
                      const labelText = type === "RESERVATION" ? "예약 주문" : "현장 주문";

                      return [`${Number (value)} 건`, labelText];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartWrapper>
          )}
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

const ScheduleCard = styled(ChartCard)`
  max-height: 400px;
  overflow-y: auto;
`;

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

const LoadMoreButton = styled.button`
  margin: 12px auto 0;
  display: block;
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border-radius: 8px;
  border: none;
  cursor: pointer;

  &:hover {
    background: #2563eb;
  }
`;

const Sales = styled.div`
  font-weight: 600;
`;

const ChartWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 320px;
`;

const OrderTypeCard = styled(ChartCard)`
  padding: 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
`;

const PiePlaceholder = styled(ChartPlaceholder)``;