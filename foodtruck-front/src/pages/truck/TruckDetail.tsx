import { truckApi } from '@/apis/truck/truck.api';
import KakaoMap from '@/components/map/KakaoMap';
import { type TruckDetailResponse } from '@/types/truck/truck.dto';
import styled from '@emotion/styled'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

function TruckDetail() {
  const {truckId} = useParams();
  const[truck, setTruck] = useState<TruckDetailResponse | null>(null);

  useEffect(() => {
    if(!truckId) return;

    truckApi.getTruckById(Number(truckId)).then(data =>{
      setTruck(data);
    });
  }, [truckId]);

  const activeSchedule = useMemo(() => {
    if(!truck || truck.schedules.length === 0) return null;

    const now = new Date();

    return (
      truck.schedules.find(schedule => {
        return (
          schedule.status == "OPEN" &&
          new Date(schedule.startTime) <= now &&
          new Date(schedule.endTime) >= now
        );
      }) ?? truck.schedules[0]
    );
  }, [truck]);

  if(!truck) return null;

  const center = activeSchedule 
    ? {lat: Number(activeSchedule.latitude), lng: Number(activeSchedule.longitude)} 
    : {lat: 35.15776, lng: 129.05657};

  const markers = activeSchedule
    ? [{lat: center.lat, lng: center.lng}]
    : [];

  return (
    <Container>
      <Header>
        <TitleRow>
          <TruckName>{truck.name}</TruckName>
          <Status data-status={truck.status}>{truck.status}</Status>
        </TitleRow>
        {truck.cuisine && <Cuisine>{truck.cuisine}</Cuisine>}
      </Header>

      <Section>
        <SectionTitle>위치</SectionTitle>
        <LocationText>
          {activeSchedule?.locationName ?? "위치 정보 없음"}
        </LocationText>

        <MapWrapper>
          <KakaoMap center={center} markers={markers}/>
        </MapWrapper>
      </Section>

      <Section>
        <SectionTitle>영업 일정</SectionTitle>
        <ScheduleList>
          {truck.schedules.map((schedule, idx) => (
            <ScheduleItem key={idx}>
              <div>
                <div>{schedule.locationName}</div>
                <ScheduleTime>
                  {new Date(schedule.startTime).toLocaleString()} ~{' '}
                  {new Date(schedule.endTime).toLocaleDateString()}
                </ScheduleTime>
              </div>

              <Badge data-status={schedule.status}>{schedule.status}</Badge>
            </ScheduleItem>
          ))}
        </ScheduleList>
      </Section>

      <Section>
        <SectionTitle>메뉴</SectionTitle>

        {truck.menu.length === 0 ? (
          <EmptyText>등록된 메뉴가 없습니다.</EmptyText>
        ) : (
          <MenuList>
            {truck.menu.map(menu => (
              <MenuItem key={menu.id}>
                <span>{menu.name}</span>
                <span>{menu.price.toLocaleString()} KRW</span>
              </MenuItem>
            ))}
          </MenuList>
        )}
      </Section>
    </Container>
  )
}

export default TruckDetail

const Container = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TruckName = styled.h1`
  font-size: 22px;
  margin: 0;
`;

const Status = styled.span`
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 8px;
  background-color: #e6f7ec;
  color: #1a7f37;
`;

const Cuisine = styled.div`
  font-size: 14px;
  color: #666;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  margin: 0;
`;

const LocationText = styled.div`
  font-size: 14px;
  color: #444;
`;

const MapWrapper = styled.div`
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
`;

const ScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ScheduleItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 10px;
  background-color: #fafafa;
`;

const ScheduleTime = styled.div`
  font-size: 12px;
  color: #777;
`;

const Badge = styled.span`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 8px;

  &[data-status="OPEN"] {
    background-color: #e6f7ec;
    color: #1a7f37;
  }

  &[data-status="PLANNED"] {
    background-color: #e0f2fe;
    color: #0369a1;
  }
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-radius: 10px;
  background-color: white;
  border: 1px solid #eee;
`;

const EmptyText = styled.div`
  font-size: 14px;
  color: #888;
`;