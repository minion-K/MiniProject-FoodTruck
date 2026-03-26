import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import ScheduleStatisticsModal from "./ScheduleStatisticsModal";
import type { DashboardResponse, OrderTypeResponse, RefundResponse, ScheduleSalesResponse, TopMenuResponse, WeeklySalesResponse } from "@/types/statistics/statistics.dto";
import { statisticsApi } from "@/apis/statistics/statistics.api";
import { getErrorMsg } from "@/utils/error";
import { formatDateTime, toKstString } from "@/utils/date";
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
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"TODAY" | "WEEK" | "MONTH">("TODAY");

  const [periodStart, setPeriodStart] = useState<string | null>(null);
  const [periodEnd, setPeriodEnd] = useState<string | null>(null);
  const [weeklyStart, setWeeklyStart] = useState<string | null>(null);
  const [weeklyEnd, setWeeklyEnd] = useState<string | null>(null);

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
    const now = new Date();

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    let start: Date;
    let end: Date;
    let wStart: Date;
    let wEnd: Date;

    switch(selectedPeriod) {
      case "TODAY":
        start = new Date();
        start.setHours(0, 0, 0, 0);
        
        end = today;

        wStart = new Date();
        wStart.setDate(now.getDate() - 6);
        wStart.setHours(0, 0, 0, 0);
        wEnd = today;
        break;
      case "WEEK":
        const dayOfWeek = now.getDay();
        start = new Date(now);
        start.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        wStart = start;
        wEnd = today;
        break;
      case "MONTH":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        start.setHours(0, 0, 0, 0);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);

        wStart = start;
        wEnd = today;
        break;
    }

    setPeriodStart(toKstString(start));
    setPeriodEnd(toKstString(end));

    setWeeklyStart(toKstString(wStart));
    setWeeklyEnd(toKstString(wEnd));

    setScheduleSales([]);
    setSchedulePage(0);
    setScheduleHasMore(true);
  }, [selectedPeriod]);

  const generateDateRange = (start: string, end: string) => {
    const result = [];
    const current = new Date(start);
    const last = new Date(end);

    while(current <= last) {
      result.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return result;
  }

  const fillEmptyDates = (
    start: string,
    end: string,
    data: WeeklySalesResponse[]
  ) => {
    const dateRange = generateDateRange(start, end);

    const map = new Map(
      data.map(item => [
        new Date(item.date).toDateString(),
        item.sales
      ])
    );

    return dateRange.map(date => {
      const key = date.toDateString();

      return {
        date: toKstString(date),
        sales: map.get(key) ?? 0
      };
    });
  };

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
    if(!periodStart || !periodEnd) return;

    try {
      const schedules = await statisticsApi.getSchedules(
        periodStart,
        periodEnd,
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
    if(!periodStart || !periodEnd || !weeklyStart || !weeklyEnd) return;

    const fetchStatistics = async () => {
      try {
        const dashboardResponse = await statisticsApi.getDashboard(
          periodStart,
          periodEnd,
          selectedTruckId ?? undefined
        );
        setDashboard(dashboardResponse);

        const weeklySalesResponse = await statisticsApi.getWeeklySales(
          weeklyStart,
          weeklyEnd,
          selectedTruckId ?? undefined
        );

        const filledWeeklySales = fillEmptyDates(
          weeklyStart,
          weeklyEnd,
          weeklySalesResponse
        );
        setWeeklySales(filledWeeklySales);

        const topMenusResponse = await statisticsApi.getTopMenus(
          periodStart,
          periodEnd,
          selectedTruckId ?? undefined
        );
        setTopMenus(topMenusResponse);

        await fetchSchedules(0);

        const refundResponse = await statisticsApi.getRefundCount(
          periodStart,
          periodEnd,
          selectedTruckId ?? undefined
        );
        setRefundCount(refundResponse);

        const orderTypeResponse = await statisticsApi.getOrderTypes(
          periodStart,
          periodEnd,
          selectedTruckId ?? undefined
        );
        setOrderTypes(orderTypeResponse);
      } catch(e) {
        alert(getErrorMsg(e));
      }
    };

    

    fetchStatistics();
  }, [selectedTruckId, periodStart, periodEnd, weeklyStart, weeklyEnd]);

  const orderTypesWithColor = orderTypes.map(item => ({
    ...item,
    count: Number (item.count),
    fill: item.type === "RESERVATION" ? "#3b82f6" : "#f97316"
  }))

  const total = orderTypes.reduce((sum, e) => sum + e.count, 0);

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
          <PeriodButton 
            active={selectedPeriod === "TODAY"}
            onClick={() => setSelectedPeriod("TODAY")}
          >
            오늘
          </PeriodButton>
          <PeriodButton
            active={selectedPeriod === "WEEK"}
            onClick={() => setSelectedPeriod("WEEK")}
          >
            이번 주
          </PeriodButton>
          <PeriodButton
            active={selectedPeriod === "MONTH"}
            onClick={() => setSelectedPeriod("MONTH")}
          >
            이번 달
          </PeriodButton>
        </PeriodTabs>
      </HeaderRight>


      <CardGrid>
        <StatCard>
          <StatLabel>
            {selectedPeriod === "TODAY"
              ? "오늘 매출"
              : selectedPeriod === "WEEK"
              ? "이번 주 매출"
              : "이번 달 매출"}
          </StatLabel>
          <StatValue>{dashboard?.totalSales?.toLocaleString() ?? 0} KRW</StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>총 주문</StatLabel>
          <StatValue>{dashboard?.orderCount ?? 0}</StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>예약 수</StatLabel>
          <StatValue>{dashboard?.reservationCount ?? 0}</StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>환불</StatLabel>
          <StatValue>{refundCount?.refundCount ?? 0}</StatValue>
        </StatCard>
      </CardGrid>
      
      <Row>
        <ChartCard>
          <CardTitle>
            {selectedPeriod === "TODAY"
              ? "주간 매출 현황"
              : selectedPeriod === "WEEK"
              ? "이번 주 매출 현황"
              : "이번 달 매출 현황"}
          </CardTitle>
          
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
          {topMenus.length === 0 ? (
            <EmptyState>데이터 없음</EmptyState>
          ) : (
            <MenuList itemCount={topMenus.length}>
              {topMenus.map((menu, idx) => (
                <MenuListItem key={idx}>
                  <MenuName>{idx + 1}. {menu.menuName}</MenuName>
                  <MenuQty>{menu.totalQty}</MenuQty>
                </MenuListItem>
            ))}
          </MenuList>  
          )}
          
        </MenuCard>
      </Row>

      <Row>
        <ScheduleCard>
          <CardTitle>
            {selectedPeriod === "TODAY"
              ? "오늘 스케줄 매출"
              : selectedPeriod === "WEEK"
              ? "이번 주 스케줄 매출"
              : "이번 달 스케줄 매출"}
          </CardTitle>

          {scheduleSales.length === 0 ? (
            <EmptyState>데이터 없음</EmptyState>
          ) : (
            <>
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
                  <ScheduleInfoWrapper>
                    <ScheduleLocation>{schedule.locationName}</ScheduleLocation>
                    <ScheduleTime>{formatDateTime(schedule.startTime)}</ScheduleTime>
                  </ScheduleInfoWrapper>

                  <Sales>{schedule.sales.toLocaleString()} KRW</Sales>
                </ScheduleItemWrapper>
              ))}

          {scheduleHasMore && (
            <LoadMoreButton onClick={() => fetchSchedules(schedulePage + 1)}>
              더보기
            </LoadMoreButton>
          )}
            </>
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
                    paddingAngle={2}
                    labelLine={false}
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

              <OrderTypeLegend>
                {orderTypes.map(
                  item => {
                    const percent = total > 0 ? ((item.count / total) * 100).toFixed(0) : 0

                    const color = item.type === "RESERVATION" ? "#3b82f6" : "#f97316";
                    const type = item.type === "RESERVATION" ? "예약 주문" : "현장 주문";

                    return (
                      <LegendItem key={item.type}>
                        <ColorDot color={color}/>
                          {type} {percent}%
                      </LegendItem>
                    )}
                )}
              </OrderTypeLegend>
            </ChartWrapper>
          )}
        </OrderTypeCard>
      </Row>

      {selectedSchedule && (
        <ScheduleStatisticsModal 
          schedule={selectedSchedule}
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
`;

const StatLabel = styled.strong`
  color: #6b7280;
`;

const StatValue = styled.span`
  display: block;
  font-size: 22px;
  font-weight: 700;
  margin-top: 6px;
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

const MenuCard = styled(ChartCard)`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 20px;
`;

const MenuList = styled.ul<{itemCount: number}>`
  list-style: none;
  padding-top: 10px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: ${({itemCount}) => itemCount >= 5 ? "space-between" : "flex-start"};
  min-height: 220px;
`;

const MenuListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const MenuName = styled.span`
  font-weight: 500;
  color: #374151;
`;

const MenuQty = styled.span`
  font-weight: 600;
  color: #374151;
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
`;

const ScheduleInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ScheduleLocation = styled.span`
  font-weight: 700;
  font-size: 14px;
`;

const ScheduleTime = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

const Sales = styled.div`
    font-weight: 600;
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

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 320px;
`;

const OrderTypeLegend = styled.div`
  display: flex;
  gap: 6px;
  width: 100%;
  align-items: flex-start;
  justify-content: center;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
`;

const ColorDot = styled.div<{color: string}>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({color}) => color};
`;

const OrderTypeCard = styled(ChartCard)`
  padding: 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
`;

const PiePlaceholder = styled(ChartPlaceholder)``;

const EmptyState = styled(ChartPlaceholder)``;