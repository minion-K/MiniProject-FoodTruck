import { statisticsApi } from '@/apis/statistics/statistics.api';
import { type ScheduleDetailResponse } from '@/types/statistics/statistics.dto';
import { getErrorMsg } from '@/utils/error';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'

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

  return (
    <Overlay>
      <Modal>
        <Header>
          <h3>스케줄 매출 상세</h3>
          <button onClick={onClose}>X</button>
        </Header>

        <Info>
          <strong>{schedule.location}</strong>
          <span>{schedule.time}</span>
        </Info>

        <Sales>{schedule.sales.toLocaleString()} KRW</Sales>

        <ContentRow>
          <LeftSection>
            <SectionTitle>주문 유형</SectionTitle>

            <PieChartPlaceholder>
              파이 차트 영역
            </PieChartPlaceholder>

            <OrderTypeLegend>
              <LegendItem>
                <ColorDot color="#3b82f6"/>
                예약 주문 40%
              </LegendItem>

              <LegendItem>
                <ColorDot color="#f97316"/>
                현장 주문 60%
              </LegendItem>
            </OrderTypeLegend>
          </LeftSection>

          <RightSection>
            <Section>
              <SectionTitle>인기 메뉴</SectionTitle>
              <MenuList>
                {detail?.topMenu.map((menu, idx) => (
                  <li key={menu.menuName}>
                    {idx + 1}. {menu.menuName}
                    <span>{menu.totalQty}</span>
                  </li>
                ))}
              </MenuList>
            </Section>

            <Section>
              <SectionTitle>시간대 주문</SectionTitle>
              <TimeList>
                {detail?.timeSlot.map(time => (
                  <li key={time.timeSlot}>
                    {time.timeSlot}
                    <span>{time.count}</span>
                  </li>
                ))}
              </TimeList>
            </Section>
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
  width: 420px;
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

const Info = styled.div`
  display: flex;
  justify-content: space-between;
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

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
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

  li {
    display: flex;
    justify-content: space-between;
  }
`;

const TimeList = styled(MenuList)``;

const OrderTypeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OrderTypeItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 0;

  span {
    color: #6b7280;
  }

  strong {
    color: #111827;
  }
`;