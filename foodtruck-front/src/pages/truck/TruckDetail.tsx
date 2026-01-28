import { truckApi } from "@/apis/truck/truck.api";
import KakaoMap from "@/components/map/KakaoMap";
import ReservationModal from "@/components/reservation/ReservationModal";
import { useAuthStore } from "@/stores/auth.store";
import type { TruckScheduleItemResponse } from "@/types/schedule/schedule.dto";
import { type TruckDetailResponse } from "@/types/truck/truck.dto";
import styled from "@emotion/styled";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function TruckDetail() {
  const { truckId } = useParams();
  const [truck, setTruck] = useState<TruckDetailResponse | null>(null);
  const { accessToken, isInitialized } = useAuthStore();
  const [selectedSchedule, setSelectedSchedule] =
    useState<TruckScheduleItemResponse | null>(null);

  const navigate = useNavigate();

  const handleReservationClick = (schedule: TruckScheduleItemResponse) => {
    const isLoggedIn = isInitialized === true && accessToken !== null;

    if (!isInitialized) return;

    if (!isLoggedIn) {
      alert("예약은 로그인 후에 가능합니다.");

      return navigate("/login");
    }

    setSelectedSchedule(schedule);
  };

  const isReservation = (schedule: TruckScheduleItemResponse) => {
    const now = new Date();

    return (
      schedule.status === "OPEN" &&
      new Date(schedule.startTime) <= now &&
      new Date(schedule.endTime) >= now
    );
  };

  useEffect(() => {
    if (!truckId) return;

    truckApi.getTruckById(Number(truckId)).then((data) => {
      setTruck(data);
    });
  }, [truckId]);

  const activeSchedule = useMemo(() => {
    if (!truck || truck.schedules.length === 0) return null;

    const now = new Date();

    return (
      truck.schedules.find((schedule) => {
        return (
          schedule.status == "OPEN" &&
          new Date(schedule.startTime) <= now &&
          new Date(schedule.endTime) >= now
        );
      }) ?? truck.schedules[0]
    );
  }, [truck]);

  if (!truck) return null;

  const center = activeSchedule
    ? { lat: activeSchedule.latitude, lng: activeSchedule.longitude }
    : { lat: 35.15776, lng: 129.05657 };

  const markers = activeSchedule ? [{ lat: center.lat, lng: center.lng }] : [];

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
          <KakaoMap center={center} markers={markers} />
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
                  {new Date(schedule.startTime).toLocaleString()} ~{" "}
                  {new Date(schedule.endTime).toLocaleDateString()}
                </ScheduleTime>
              </div>

              <ScheduleRight>
                <Badge data-status={schedule.status}>{schedule.status}</Badge>

                <ReservationButton
                  disabled={!isReservation(schedule)}
                  onClick={() => handleReservationClick(schedule)}
                >
                  예약하기
                </ReservationButton>
              </ScheduleRight>
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
            {truck.menu.map((menu) => (
              <MenuItem key={menu.id}>
                <MenuName isSoldOut={menu.isSoldOut}>
                  {menu.name}
                  {menu.isSoldOut && <SoldOutBadge>품절</SoldOutBadge>}
                </MenuName>
                <MenuPrice>{menu.price.toLocaleString()} KRW</MenuPrice>
              </MenuItem>
            ))}
          </MenuList>
        )}
      </Section>

      {selectedSchedule && (
        <ReservationModal
          schedule={selectedSchedule}
          menus={truck.menu}
          onClose={() => setSelectedSchedule(null)}
        />
      )}
    </Container>
  );
}

export default TruckDetail;

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

const ScheduleRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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

const ReservationButton = styled.button<{ disabled?: boolean }>`
  padding: 6px 8px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  border: none;

  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  background-color: ${({ disabled }) => (disabled ? "#e5e7eb" : "#ff6b00")};

  color: ${({ disabled }) => (disabled ? "#9ca3af" : "#ffffff")};

  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? "#e5e7eb" : "#e55f00")};
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
  align-items: center;
  padding: 12px;
  border-radius: 10px;
  background-color: white;
  border: 1px solid #eee;
`;

const MenuName = styled.div<{ isSoldOut?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;

  color: ${({ isSoldOut }) => (isSoldOut ? "rgba(0,0,0,0.5)" : "#000")};
`;

const MenuPrice = styled.div`
  font-weight: 500;
`;
const SoldOutBadge = styled.div`
  color: red;
  font-size: 12px;
  font-weight: 600;
  margin-left: 6px;
`;

const EmptyText = styled.div`
  font-size: 14px;
  color: #888;
`;
