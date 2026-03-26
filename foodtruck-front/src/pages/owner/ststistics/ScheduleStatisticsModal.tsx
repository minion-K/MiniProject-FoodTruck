import { statisticsApi } from '@/apis/statistics/statistics.api';
import { type ScheduleDetailResponse } from '@/types/statistics/statistics.dto';
import { getErrorMsg } from '@/utils/error';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'
import { Pie, PieChart, ResponsiveContainer } from 'recharts';

interface Props {
  schedule: {
    id: number;
    location: string;
    time: string;
    sales: number;
  };

  onClose: () => void;
}

function ScheduleStatisticsModal({schedule, onClose}: Props) {
  const [detail, setDetail] = useState<ScheduleDetailResponse | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await statisticsApi.getSchedulesDetail(schedule.id)
        setDetail(data);
      } catch (e) {
        alert(getErrorMsg(e));
      }
    };

    fetchDetail();
  }, [schedule.id])

  const orderTypesWithColor = detail?.orderType.map(item => ({
    ...item,
    count: Number (item.count),
    fill: item.type === "RESERVATION" ? "#3b82f6" : "#f97316"
  }))

  const total = detail?.orderType.reduce(
    (sum, e) => sum + e.count, 0) ?? 0;

  return (
    <Overlay>
      <Modal>
        <Header>
          <ModalTitle>스케줄 매출 상세</ModalTitle>
          <Close onClick={onClose}>X</Close>
        </Header>

        <Info>
          <Location>{schedule.location}</Location>
          <Time>{schedule.time}</Time>
        </Info>

        <Sales>{schedule.sales.toLocaleString()} KRW</Sales>

        <ContentRow>
          <LeftSection>
            <SectionCard>
              <SectionTitle>주문 유형</SectionTitle>
              {detail?.orderType.length === 0 ? (
                <PieChartPlaceholder>데이터 없음</PieChartPlaceholder>
              ) : (
                <ChartWrapper>
                  <PieWrapper>
                    <ResponsiveContainer
                      width="100%"
                      height={140}              
                    >
                      <PieChart>
                        <Pie
                          data={orderTypesWithColor}
                          dataKey="count"
                          nameKey="type"
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={70}
                          paddingAngle={2}
                          labelLine={false}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </PieWrapper>

                  <OrderTypeLegend>
                    {detail?.orderType.map(
                      item => {
                        const percent = total > 0 ? ((item.count / total) * 100).toFixed(0) : 0

                        const color = item.type === "RESERVATION" ? "#3b82f6" : "#f97316";
                        const type = item.type === "RESERVATION" ? "예약 주문" : "현장 주문";

                        return (
                          <LegendItem key={item.type}>
                            <ColorDot color={color}/>
                              {type} {percent}%
                          </LegendItem>
                        )
                      }
                    )}
                  </OrderTypeLegend>
                </ChartWrapper>
              )}
            </SectionCard>
          </LeftSection>

          <RightSection>
            <SectionCard>
              <SectionTitle>인기 메뉴</SectionTitle>
              <MenuList>
                {detail?.topMenu.map((menu, idx) => (
                  <MenuItem key={menu.menuName}>
                    {idx + 1}. {menu.menuName}
                    <MenuQty>{menu.totalQty}</MenuQty>
                  </MenuItem>
                ))}
              </MenuList>
            </SectionCard>

            <SectionCard>
              <SectionTitle>시간대 주문</SectionTitle>
              <TimeList>
                {detail?.timeSlot.map(time => (
                  <TimeItem key={time.timeSlot}>
                    {time.timeSlot}
                    <OrderQty>{time.count}</OrderQty>
                  </TimeItem>
                ))}
              </TimeList>
            </SectionCard>
          </RightSection>
        </ContentRow>
      </Modal>
    </Overlay>
  )
}

export default ScheduleStatisticsModal

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  width: 90%;
  max-width: 420px;
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;

  button {
    border: none;
    background: transparent;
    font-size: 16px;
    cursor: pointer;
  }
`;

const ModalTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
`;

const Close = styled.button`
  border: none;
  background: transparent;
  font-size: 16px;
  cursor: pointer;
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Location = styled.strong`
  font-weight: 600;
  color: #111827;
`;

const Time = styled.span`
  font-size: 13px;
  color: #6b7280;
`;

const Sales = styled.div`
  font-size: 20px;
  font-weight: 700;
`;

const ContentRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;

const SectionCard = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
`;

const PieChartPlaceholder = styled.div`
  height: 140px;
  border-radius: 10px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #6b7280;
`;

const OrderTypeLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  align-items: flex-start;
`;

const PieWrapper = styled.div`
  width: 100%;
`;

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
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

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
`;

const MenuItem = styled.li`
  display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f3f4f6;
    cursor: default;
    transition: background 0.1s;

    &:hover {
      background: #f3f4f6;
    }

    &:last-child {
      border-bottom: none;
    }
`;

const MenuQty = styled.strong`
  color: #3b82f6;
`;
const TimeList = styled(MenuList)``;

const TimeItem = styled(MenuItem)``;

const OrderQty = styled(MenuQty)``;