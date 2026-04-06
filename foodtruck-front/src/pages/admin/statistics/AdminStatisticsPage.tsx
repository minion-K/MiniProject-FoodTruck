import { adminStatisticsApi } from '@/apis/statistics/adminStatistics.api';
import type { PaymentStatus } from '@/types/payment/payment.type';
import { REGION_LIST, type Regions } from '@/types/region/region.type';
import { type AdminConversionFunnelResponse, type AdminDashboardResponse, type AdminGrowthTrendResponse, type AdminInsightResponse, type AdminOrderTypesResponse, type AdminPaymentStatusResponse, type AdminTopMenuResponse, type AdminTopTruckResponse } from '@/types/statistics/statistics.dto';
import { toKstString } from '@/utils/date';
import { getErrorMsg } from '@/utils/error';
import { getPaymentStatus } from '@/utils/paymentStatus';
import styled from '@emotion/styled';
import { Autocomplete, TextField} from '@mui/material';
import React, { useEffect, useState } from 'react'
import { CartesianGrid, Cell, Funnel, FunnelChart, LabelList, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, type YAxisProps } from 'recharts';

type Period = "TODAY" | "WEEK" | "MONTH";
type GrowTab = "REVENUE" | "ORDER" | "USER" | "TRUCK";
type RegionFilter = Regions | "ALL";
type Option = {
  value: RegionFilter;
  label: string;
}

function AdminStatisticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("TODAY");
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>("ALL");
  const [growTab, setGrowTab] = useState<GrowTab>("REVENUE");

  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(null);
  const [growthTrend, setGrowthTrend] = useState<AdminGrowthTrendResponse[]>([]);
  const [conversionFunnel, setConversionFunnel] = useState<AdminConversionFunnelResponse | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<AdminPaymentStatusResponse[]>([]);
  const [orderTypes, setOrderTypes] = useState<AdminOrderTypesResponse[]>([]);
  const [topTrucks, setTopTrucks] = useState<AdminTopTruckResponse[]>([]);
  const [topMenus, setTopMenus] = useState<AdminTopMenuResponse[]>([]);
  const [insights, setInsights] = useState<AdminInsightResponse[]>([]);

  const [periodStart, setPeriodStart] = useState<string | null>(null);
  const [periodEnd, setPeriodEnd] = useState<string | null>(null);
  const [trendStart, setTrendStart] = useState<string | null>(null);
  const [trendEnd, setTrendEnd] = useState<string | null>(null);

  const [inputValue, setInputValue] = useState("");
  const [currentInsightIdx, setCurrentInsightIdx] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
  
      setTrendStart(toKstString(wStart));
      setTrendEnd(toKstString(wEnd));
  
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
      data: AdminGrowthTrendResponse[]
    ) => {
      const dateRange = generateDateRange(start, end);
  
      const map = new Map(
        data.map(item => [
          new Date(item.date).toDateString(),
          item
        ])
      );
  
      return dateRange.map(date => {
        const key = date.toDateString();
        const found = map.get(key);

        if(found) return found;
  
        return {
          date: toKstString(date),
          revenue: 0,
          orderCount: 0,
          userCount: 0,
          truckCount: 0
        };
      });
    };

  useEffect(() => {
    if(!periodStart || !periodEnd || !trendStart || !trendEnd) return ;

    const fetchAdminStatistics = async () => {
      const params = {
        region: selectedRegion,
        fromDate: periodStart,
        toDate: periodEnd
      }
      
      try {
        const dashboardResponse = await adminStatisticsApi.getDashboard(params);
        setDashboard(dashboardResponse);

        const growthResponse = await adminStatisticsApi.getGrowthTrend({
          region:selectedRegion,
          fromDate: trendStart,
          toDate: trendEnd
        });
        const filledGrowth = fillEmptyDates(
          trendStart,
          trendEnd,
          growthResponse
        );

        setGrowthTrend(filledGrowth);

        const ConversionResponse = await adminStatisticsApi.getConversionFunnel(params);
        setConversionFunnel(ConversionResponse);

        const paymentResponse = await adminStatisticsApi.getPaymentStatus(params);
        const normalized = normalizePaymentStatus(paymentResponse);
        setPaymentStatus(normalized);

        const ordertypesResponse = await adminStatisticsApi.getOrderTypes(params);
        setOrderTypes(ordertypesResponse);

        const topTrucksResponse = await adminStatisticsApi.getTopTrucks(params);
        setTopTrucks(topTrucksResponse);

        const topMenusResponse = await adminStatisticsApi.getTopMenus(params);
        setTopMenus(topMenusResponse);

        const insightsResponse = await adminStatisticsApi.getInsights(params);
        setInsights(insightsResponse);
      } catch (e) {
        alert(getErrorMsg(e));
      }
    };

    fetchAdminStatistics();
  }, [periodStart, periodEnd, selectedRegion]);

  const slides = insights.length > 0 ? [insights[insights.length - 1], ...insights, insights[0]] : [];

  useEffect(() => {
    if(insights.length <= 1) return;

    let timer: number;
    
    const startSlide = () => {
      timer = window.setTimeout(() => {
        setCurrentInsightIdx(prev => prev + 1);
        startSlide();
      }, 3000);
    }

    startSlide();

    const handleVisible = () => {
      if(!document.hidden) {
        clearTimeout(timer);
        setCurrentInsightIdx(prev => {
          if(prev <= 0) return 1;
          if(prev >= slides.length - 1) return slides.length - 2;

          return prev;
        });

        setIsTransitioning(true);
        startSlide();
      }
    }

    document.addEventListener('visibilitychange', handleVisible);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisible);  
    }
  }, [insights]);

  const handleTransitionEnd = () => {
    if(currentInsightIdx === slides.length - 1) {
      setIsTransitioning(false);
      setCurrentInsightIdx(1);
    } else if(currentInsightIdx === 0) {
      setIsTransitioning(false);
      setCurrentInsightIdx(slides.length - 2);
    }
  };

  useEffect(() => {
    if(!isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(true), 0);

      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const getChangeText = (rate?: number) => {
    if(!rate) return "0%";

    if(rate > 0) return `▲${rate.toFixed(1)}%`;
    if(rate < 0) return `▼${Math.abs(rate).toFixed(1)}`;
    
    return "0%";
  }

  const growthData = growthTrend.map(item => ({
    date: item.date,
    revenue: item.revenue,
    orderCount: item.orderCount,
    userCount: item.userCount,
    truckCount: item.truckCount
  }));

  const currentGrowthKey = growTab === "REVENUE" ? "revenue"
                          : growTab === "ORDER" ? "orderCount"
                          : growTab === "USER" ? "userCount" : "truckCount";

  const growthLabel = growTab === "REVENUE" ? "수익 (원)"
                      : growTab === "ORDER" ? "주문"
                      : growTab === "USER" ? "유저" : "트럭";

  const getColor = () => {
    switch (growTab) {
      case "REVENUE": return "#3b83f6";
      case "ORDER": return "#10b981";
      case "USER": return "#f59e0b";
      case "TRUCK": return "#ef4444";
    }
  }

  const getDomain: YAxisProps["domain"] = (growTab === "REVENUE")
    ? ([min, max]) => [min * 0.9, max * 1.1]
    : [0, "auto"];

  const funnelData = conversionFunnel ? [
    {
      name: "예약",
      value: conversionFunnel.reservations ?? 0,
      label: `예약 ${(conversionFunnel.reservations ?? 0).toLocaleString()}`,
      fill: "#94a3b8"
    },
    {
      name: "예약 확정",
      value: conversionFunnel.confirmedReservations ?? 0,
      label: `예약 확정: ${(conversionFunnel.confirmedReservations ?? 0).toLocaleString()}`,
      fill: "#60a5fa"
    },
    {
      name: "주문",
      value: conversionFunnel.orders ?? 0,
      label: `주문: ${(conversionFunnel.orders ?? 0).toLocaleString()} (${(conversionFunnel.reservationToOrderRate ?? 0).toFixed(1)}%)`,
      fill: "#34d399"
    },
    {
      name: "결제",
      value: conversionFunnel.paidOrders ?? 0,
      label: `결제: ${(conversionFunnel.paidOrders ?? 0).toLocaleString()} (${(conversionFunnel.orderToPaymentRate ?? 0).toFixed(1)}%)`,
      fill: "#fbbf24"
    }
  ] : [];

  const Payment_status: PaymentStatus[] = ["READY", "SUCCESS", "FAILED", "CANCELLED"]
  const normalizePaymentStatus = (data: AdminPaymentStatusResponse[]) => {
    const map = new Map<PaymentStatus, AdminPaymentStatusResponse>(
      data.map(item => [item.status, item])
    );

    return Payment_status.map(status => {
      const found = map.get(status);

      return {
        status,
        count: found?.count ?? 0,
        amount: found?.amount ?? 0
      };
    });
  };

  const filleredPaymentStatus = paymentStatus.filter(d => d.count > 0);

  const orderTypesWithColor = orderTypes.map(item => ({
    ...item,
    count: Number (item.count),
    fill: item.status === "RESERVATION" ? "#3b82f6" : "#f97316"
  }))

  const total = orderTypes.reduce((sum, e) => sum + e.count, 0);


  const options: Option[] = [{value: "ALL", label: "전체"},
    ...REGION_LIST.map(region => ({value: region, label: region}))
  ];
  
  return (
    <Container>
      <Header>
        <Title>통계 대시보드 (관리자)</Title>
      </Header>

      <HeaderRight>
        <PeriodTabs>
          {(["TODAY", "WEEK", "MONTH"] as Period[]).map(period => (
            <PeriodButton
              key={period}
              active={selectedPeriod === period}
              onClick={() => setSelectedPeriod(period)}
            >
              {period === "TODAY" ? "오늘" :
                period === "WEEK" ? "이번 주" : "이번 달"}
            </PeriodButton>
          ))}
        </PeriodTabs>

        <Autocomplete 
          options={options}
          value={
            selectedRegion === "ALL" 
            ? null 
            : options.find(o => o.value === selectedRegion) ?? null}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => {
            setInputValue(newInputValue);
          }}
          onChange={(_, newValue) => {
            setSelectedRegion((newValue?.value ?? "ALL") as RegionFilter);
            setInputValue(newValue?.label ?? "");
          }}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderInput={(params) => (
            <TextField {...params} size="small" placeholder="지역 검색" />
          )}
          sx={{width: 200}}
        />
      </HeaderRight>

      <CardGrid>
        <StatCard>
          <StatLabel>총 매출</StatLabel>
          <StatValue>
            <ValueText>{dashboard?.totalRevenue?.toLocaleString() ?? 0} KRW</ValueText>
            <ChangeRate rate={dashboard?.refundChangeRate ?? 0}>
              {getChangeText(dashboard?.revenueChangeRate)}
            </ChangeRate>
          </StatValue>
          <CompareText>
            {selectedPeriod === "TODAY" ? "vs어제"
              : selectedPeriod === "WEEK" ? "지난 주" : "지난 달"}
          </CompareText>
        </StatCard>

        <StatCard>
          <StatLabel>주문 수</StatLabel>
          <StatValue>
            <ValueText>{dashboard?.totalOrders ?? 0}</ValueText>
            <ChangeRate rate={dashboard?.orderChangeRate ?? 0}>
              {getChangeText(dashboard?.orderChangeRate)}
            </ChangeRate>
          </StatValue>
          <CompareText>
            {selectedPeriod === "TODAY" ? "vs 어제"
              : selectedPeriod === "WEEK" ? "vs 지난 주" : "vs 지난 달"}
          </CompareText>
        </StatCard>

        <StatCard>
          <StatLabel>예약 수</StatLabel>
          <StatValue>
            <ValueText>{dashboard?.totalReservations ?? 0}</ValueText>
            <ChangeRate rate={dashboard?.reservationChangeRate ?? 0}>
              {getChangeText(dashboard?.reservationChangeRate)}
            </ChangeRate>
          </StatValue>
          <CompareText>
            {selectedPeriod === "TODAY" ? "vs어제"
              : selectedPeriod === "WEEK" ? "지난 주" : "지난 달"}
          </CompareText>
        </StatCard>

        <StatCard>
          <StatLabel>환불 건수</StatLabel>
          <StatValue>
            <ValueText>{dashboard?.totalRefunds ?? 0}</ValueText>
            <ChangeRate rate={dashboard?.refundChangeRate ?? 0}>
              {getChangeText(dashboard?.refundChangeRate)}
            </ChangeRate>
          </StatValue>
          <CompareText>
            {selectedPeriod === "TODAY" ? "vs어제"
              : selectedPeriod === "WEEK" ? "지난 주" : "지난 달"}
          </CompareText>
        </StatCard>

        <StatCard>
          <StatLabel>유저 수</StatLabel>
          <StatValue>
            <ValueText>{dashboard?.totalUsers ?? 0}</ValueText>
            <ChangeRate rate={dashboard?.userChangeRate ?? 0}>
              {getChangeText(dashboard?.userChangeRate)}
            </ChangeRate>
          </StatValue>
          <CompareText>
            {selectedPeriod === "TODAY" ? "vs어제"
              : selectedPeriod === "WEEK" ? "지난 주" : "지난 달"}
          </CompareText>
        </StatCard>

        <StatCard>
          <StatLabel>트럭 수</StatLabel>
          <StatValue>
            <ValueText>{dashboard?.activeTrucks ?? 0}</ValueText>
            <ChangeRate rate={dashboard?.truckChangeRate ?? 0}>
              {getChangeText(dashboard?.truckChangeRate)}
            </ChangeRate>
          </StatValue>
          <CompareText>
            {selectedPeriod === "TODAY" ? "vs어제"
              : selectedPeriod === "WEEK" ? "지난 주" : "지난 달"}
          </CompareText>
        </StatCard>

        <StatCard>
          <StatLabel>전환율</StatLabel>
          <StatValue>
            <ValueText>{dashboard?.conversionRate ?? 0}</ValueText>
            <ChangeRate rate={dashboard?.conversionChangeRate ?? 0}>
              {getChangeText(dashboard?.conversionChangeRate)}
            </ChangeRate>
          </StatValue>
          <CompareText></CompareText>
        </StatCard>
      </CardGrid>
      <Row>
        <ChartCard>
          <CardTitle>성장 추이</CardTitle>
          <TabRow>
            {(["REVENUE", "ORDER", "USER", "TRUCK"] as GrowTab[]).map(tab => (
              <TabButton
                key={tab}
                active={growTab === tab}
                onClick={() => setGrowTab(tab)}
              >
                {tab == "REVENUE" ? "수익" :
                  tab === "ORDER" ? "주문" :
                  tab === "USER" ? "유저" : "트럭"}
              </TabButton>
            ))}
          </TabRow>

          {growthData.every(item => 
            item.revenue === 0 &&
            item.orderCount === 0 &&
            item.userCount === 0 &&
            item.truckCount === 0
          ) ? (
            <EmptyState>데이터가 없습니다.</EmptyState>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart 
                key={growTab}
                data={growthData}
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
                  domain={getDomain}
                  tick={({x, y, payload}) => {

                    let label;

                    if(growTab === "REVENUE") {
                      if(payload.value === 0) return null;
                      label = `${Math.round(payload.value / 10000)}만`;
                    } else {
                      label = payload.value
                    }
                    return label ? (
                      <text 
                        x={x}
                        y={y} 
                        dy={6}
                        textAnchor="end" 
                        fill="#666" 
                        fontSize={14}
                      >
                        {label}
                      </text>
                    ) : null;
                  }}
                />
                <Tooltip 
                  cursor={{strokeDasharray: "3 3"}}
                  formatter={value => {
                    if(growTab === "REVENUE") {
                      return [`${Number (value).toLocaleString()} KRW`, growthLabel];
                    }

                    return [`${value}`, growthLabel]
                  }}
                  labelFormatter={value => {
                    const d = new Date(value);
                    const days = ["일", "월", "화", "수", "목", "금", "토"]

                    return `날짜: ${d.getMonth() + 1}-${d.getDate()} (${days[d.getDay()]})`
                  }}
                />
                <Line 
                  type="monotone"
                  dataKey={currentGrowthKey}
                  name={growthLabel}
                  stroke={getColor()}
                  strokeWidth={1.3}
                  dot={false}
                  activeDot={{r: 6}}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard>
          <CardTitle>전환 퍼널</CardTitle>
          {conversionFunnel && funnelData.some(d => d.value > 0) ?  (
            <ResponsiveContainer width="100%" height={280}>
              <FunnelChart>
                <Tooltip />
                <Funnel
                  dataKey="value"
                  data={funnelData}
                  isAnimationActive={false}
                >
                  <LabelList
                    position="center"
                    dataKey="label"
                    fill="#fff"
                    fontSize={13}
                  />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState>데이터가 없습니다.</EmptyState>
          )}
        </ChartCard>
      </Row>  

      <Row>
        <ChartCard>
          <CardTitle>결제 상태</CardTitle>
          {filleredPaymentStatus.length === 0 ? (
            <EmptyState>데이터가 없습니다.</EmptyState>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie 
                    data={filleredPaymentStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    innerRadius={45}
                    label={false}
                    isAnimationActive={false}
                    labelLine={false}
                  >
                    {filleredPaymentStatus.map((entry, idx) => {
                      const paymentStatus = getPaymentStatus(entry.status);
                      
                      return (
                        <Cell 
                          key={idx}
                          fill={paymentStatus.color}
                        />
                      )
                      
                    })}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#222",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff"
                    }}
                    itemStyle={{color: "#fff"}}
                    formatter={(value,name) => {
                      const paymentStatus = getPaymentStatus(name as PaymentStatus);

                      return [`${Number(value ?? 0).toLocaleString()}건`, paymentStatus.label]
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <PaymentLegend>
                {paymentStatus.map(item => {
                  const paymentStatus = getPaymentStatus(item.status);
                  

                  return (
                    <LegendItem key={item.status}>
                      <ColorDot style={{background: paymentStatus.color}}/>
                      {paymentStatus.label}: {item.count}건
                    </LegendItem>
                  )
                })}
              </PaymentLegend>
            </>
          )}

        </ChartCard>
        <ChartCard>
          <CardTitle>주문 유형</CardTitle>
          {orderTypes.length === 0 ? (
            <EmptyState>데이터가 없습니다.</EmptyState>
          ) : (
            <>
              <ResponsiveContainer
                width="100%"
                height={280}
              >
                <PieChart>
                  <Pie
                    data={orderTypesWithColor}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    innerRadius={45}
                    paddingAngle={3}
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

                    const color = item.status === "RESERVATION" ? "#3b82f6" : "#f97316";
                    const type = item.status === "RESERVATION" ? "예약 주문" : "현장 주문";

                    return (
                      <LegendItem key={item.status}>
                        <ColorDot color={color}/>
                          {type} {percent}%
                      </LegendItem>
                    )}
                )}
              </OrderTypeLegend>
            </>
          )}
        </ChartCard>
      </Row>
      <Row>
        <ChartCard>
          <CardTitle>인기 트럭 TOP5</CardTitle>
          {topTrucks.length === 0 ? (
            <EmptyState>데이터가 없습니다.</EmptyState>
          ) : (
            <List>
              {topTrucks.map((truck, idx) => (
                <ListItem key={truck.truckId}>
                  <span>{idx + 1}. {truck.truckName}</span>
                  <span>{truck.revenue.toLocaleString()} KRW</span>
                </ListItem>
              ))}
            </List>
          )}
        </ChartCard>
        <ChartCard>
          <CardTitle>인기메뉴 TOP5</CardTitle>
          {topMenus.length === 0 ? (
            <EmptyState>데이터가 없습니다.</EmptyState>
          ) : (
            <List>
              {topMenus.map((menu, idx) => (
                <ListItem key={idx}>
                  <span>{idx + 1}. {menu.menuName}</span>
                  <span>{menu.quantity}개</span>
                </ListItem>
              ))}
            </List>
          )}
        </ChartCard>
      </Row>

      <ChartCard>
        <CardTitle>운영 인사이트</CardTitle>
        {insights.length > 0 ? (
          <InsightContainer>
            <InsightMask idx={currentInsightIdx} transitioning={isTransitioning} onTransitionEnd={handleTransitionEnd}>
              {slides.map((insight, idx) => (
                <InsightSlide key={idx}>
                  <InsightTitle>{insight.title}</InsightTitle>
                  <InsightValue>
                    {typeof insight.value === "number"
                      ? insight.value.toLocaleString()
                      : insight.value}
                    {insight.unit && ` ${insight.unit}`}
                  </InsightValue>

                  <InsightDescription>{insight.description}</InsightDescription>
                </InsightSlide>
              ))}
            </InsightMask>
          </InsightContainer>
        ) : (
          <EmptyState>데이터가 없습니다.</EmptyState>
        )}
        
      </ChartCard>
    </Container>
  )
}

export default AdminStatisticsPage

const Container = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HeaderRight = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
`;

const RegionSelect = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7db;
  background: white;
  min-width: 140px;
`;

const PeriodTabs = styled.div`
  display: flex;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: #fafafa;
`;

const PeriodButton = styled.button<{active?: boolean}>`
  padding: 8px 16px;
  border: none;
  background: ${({active}) => active ? "#3b82f6" : "white"};
  color: ${({active}) => active ? "white" : "#374151"};
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 16px;
  margin-top: 8px;
`;

const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 18px;
  transition: all 0.15s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }
`;

const StatLabel = styled.strong`
  color: #6b7280;
`;

const StatValue = styled.span`
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: 22px;
  font-weight: 700;
  margin-top: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChangeRate = styled.span<{rate: number}>`
  font-size: 12px;
  font-weight: 600;
  margin-left: 6px;
  color: ${({rate}) => 
  rate > 0 ? "#16a34a" : rate < 0 ? "#dc2626" : "#6b7280"};
`;

const ValueText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CompareText = styled.span`
  font-size: 11px;
  color: #9ca3af;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 4px;
`;

const ChartCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
`;

const OrderTypeLegend = styled.div`
  display: flex;
  gap: 12px 16px;
  flex-wrap: wrap;
  width: 100%;
  align-items: flex-start;
  justify-content: center;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 10px;
`;

const TabRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
`;

const TabButton = styled.button<{active: boolean}>`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: ${({active}) => active ? "#111827" : "#e5e7eb"};
  color: ${({active}) => active ? "white" : "#374151"};

  &:hover {
    opacity: 0.9;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const ChartPlaceholder = styled.div`
  height: 200px;
  background: #fafafa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 14px;
`;

const EmptyState = styled(ChartPlaceholder)`
  height: 160px;
`;

const PaymentLegend = styled.div`
  display: flex;
  gap: 12px 16px;
  flex-wrap: wrap;
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

const ColorDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({color}) => color};
`;

const InsightContainer = styled.div`
  height: 280px;
  overflow: hidden;
  position: relative;
  border-radius: 14px;
  background: linear-gradient(135deg, #f8fafc, #eff2ff);
  border: 1px solid #e5e7db;
`;

const InsightSlide = styled.div`
  width: 100%;
  height: 280px;
  padding: 24px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InsightMask = styled.div<{idx: number, transitioning: boolean}>`
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: ${props => props.transitioning ? "transform 0.3s ease-in-out" : "none"};
  transform: translateY(${props => -props.idx * 100}%);
`;

const InsightTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 6px;
`;

const InsightValue = styled.div`
  font-size: 36px;
  font-weight: 900;
  color: #111827;
  margin-bottom: 10px;
  line-height: 1.1;
`;

const InsightDescription = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: #4b5563;
`;