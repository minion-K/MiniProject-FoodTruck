import styled from '@emotion/styled';
import React, { useState } from 'react'

type Period = "TODAY" | "WEEK" | "MONTH";
type GrowTab = "REVENUE" | "ORDER" | "USER" | "TRUCK"

const kpiData = [
  { label: "매출", value: 1200000, changeRate: 20 },
  { label: "주문", value: 320, changeRate: -10 },
  { label: "예약", value: 210, changeRate: 5 },
  { label: "환불", value: 12, changeRate: -2 },
  { label: "유저", value: 54, changeRate: 12 },
  { label: "트럭", value: 8, changeRate: 0 },
  { label: "전환율", value: 32, changeRate: 3 },
];

function AdminStatisticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("TODAY");
  const [selectedRegion, setSeletedRegion] = useState<string>("ALL");
  const [growTab, setGrowTab] = useState<GrowTab>("REVENUE");

  const getChangeText = (rate: number) => {
    if(rate > 0) return `▲ ${rate}%`;
    if(rate < 0) return `▼ ${Math.abs(rate)}%`;
    return "0%";
  }

  return (
    <Container>
      <Header>
        <Title>통계 대시보드</Title>
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

        <RegionSelect
          value={selectedRegion}
          onChange={(e) =>setSeletedRegion(e.target.value)}
        >
          <option value="ALL">전체</option>
          <option value="BUSAN">부산</option>
          <option value="SEOUL">서울</option>
        </RegionSelect>
      </HeaderRight>

      <CardGrid>
        {kpiData.map(item => (
          <StatCard key={item.label}>
            <StatLabel>{item.label}</StatLabel>
            <StatValue>
              <ValueText>
                {item.label === "매출"
                  ? `${item.value.toLocaleString()} KRW`
                  : item.label === "전환율"
                  ? `${item.value}%`
                  : item.value}                
              </ValueText>

              <ChangeRate rate={item.changeRate}>
                {getChangeText(item.changeRate)}
              </ChangeRate>
            </StatValue>
            <CompareText>
              {selectedPeriod === "TODAY"
                ? "vs 어제"
                : selectedPeriod === "WEEK"
                ? "vs 지난 주" : "vs 지난 달" }
            </CompareText>
          </StatCard>
        ))}
        
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
          <ChartPlaceholder>그래프 영역</ChartPlaceholder>
        </ChartCard>

        <ChartCard>
          <CardTitle>전환 퍼널</CardTitle>
          <ChartPlaceholder>퍼널 차트</ChartPlaceholder>
        </ChartCard>
      </Row>
      <Row>
        <ChartCard>
          <CardTitle>결제 상태</CardTitle>
          <ChartPlaceholder />
        </ChartCard>
        <ChartCard>
          <CardTitle>결제 상태</CardTitle>
          <ChartPlaceholder />
        </ChartCard>
      </Row>
      <Row>
        <ChartCard>
          <CardTitle>트럭 TOP</CardTitle>
          <ChartPlaceholder />
        </ChartCard>
        <ChartCard>
          <CardTitle>메뉴 TOP</CardTitle>
          <ChartPlaceholder />
        </ChartCard>
      </Row>

      <ChartCard>
        <CardTitle>운영 인사이트</CardTitle>
        <InsightBox />
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

const ListPlaceholder = styled.div`
  height: 200px;
  background: #fafafa;
  border-radius: 8px;
`;

const InsightBox = styled.div`
  height: 120px;
  background: #fff7eb;
  border-radius: 8px;
  padding: 16px;
  font-size: 14px;
  color: #92400e;
`;