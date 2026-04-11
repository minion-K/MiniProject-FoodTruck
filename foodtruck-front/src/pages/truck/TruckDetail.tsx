import { truckApi } from "@/apis/truck/truck.api";
import KakaoMap from "@/components/map/KakaoMap";
import ReservationModal from "@/components/reservation/ReservationModal";
import { useAuthStore } from "@/stores/auth.store";
import type { TruckScheduleItemResponse } from "@/types/schedule/schedule.dto";
import { type TruckDetailResponse } from "@/types/truck/truck.dto";
import { formatDateTime } from "@/utils/date";
import { getErrorMsg } from "@/utils/error";
import { getTruckStatus } from "@/utils/TruckStatus";
import styled from "@emotion/styled";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function TruckDetail() {
  const { truckId } = useParams();
  const [truck, setTruck] = useState<TruckDetailResponse | null>(null);
  const [center, setCenter] = useState<{lat: number, lng: number} | null>(null);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (!truckId) return;
    setLoading(true);

    const fetchTruck = async () => {
      try {
        const res = await truckApi.getTruckById(Number (truckId));
        setTruck(res);
      } catch (e) {
        alert(getErrorMsg(e));
      } finally {
        setLoading(false);
      }
    };

    fetchTruck();
  }, [truckId]);

  useEffect(() => {
    if(activeSchedule) {
      setCenter({
        lat: activeSchedule.latitude,
        lng: activeSchedule.longitude,
      });
    }
  }, [activeSchedule]);

  const markers = center ? [{ 
    lat: center.lat, 
    lng: center.lng,
    isAcive: truck!.status === "ACTIVE"}] : [];

  const handleMoveTruck = () => {
    if(!activeSchedule) return;

    setCenter({
      lat: activeSchedule.latitude,
      lng: activeSchedule.longitude
    });
  };

  if (!truck && !loading) return null;  
  const status = getTruckStatus(truck?.status);

  return (
    <Container>
      {loading ? (
        <LoadingMsg>트럭 정보를 불러오는 중...</LoadingMsg>
      ) : ( truck ? (
        <>
          <Header>
            <TitleRow>
              <TruckName>{truck.name}</TruckName>
              <Status 
                style={{
                  background: status.bg,
                  color: status.color
                }}>{status.label}</Status>
            </TitleRow>
            {truck.cuisine && <Cuisine>{truck.cuisine}</Cuisine>}
          </Header>

          <Section>
            <SectionTitle>위치</SectionTitle>
            <LocationText>
              {activeSchedule?.locationName ?? "위치 정보 없음"}
            </LocationText>

            <MapWrapper>
              {center && (
                <KakaoMap center={center} markers={markers} />
              )}

              <MapControl>
                <FloatingButton onClick={handleMoveTruck}>📍</FloatingButton>
              </MapControl>
              {!activeSchedule && (
                <MapOverlay>위치 정보가 등록되지 않았습니다.</MapOverlay>
              )}
            </MapWrapper>
          </Section>

          <Section>
            {truck.schedules.length === 0 ? (
              <EmptyText>등록된 일정이 업습니다.</EmptyText>
            ) : (
              <>
                <SectionTitle>영업 일정</SectionTitle>
                <ScheduleList>
                  {truck.schedules.map((schedule, idx) => (
                    <ScheduleItem key={idx}>
                      <div>
                        <div>{schedule.locationName}</div>
                        <ScheduleTime>
                          {formatDateTime(schedule.startTime)} ~{" "}
                          {formatDateTime(schedule.endTime)}
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
              </>  
            )}
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
        </>      
      ) : (
        <EmptyText>트럭 정보가 없습니다.</EmptyText>
      )
      )}
      {selectedSchedule && (
        <ReservationModal
          schedule={selectedSchedule}
          menus={truck!.menu}
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
  gap: 20px;
  padding-top: 16px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TruckName = styled.h1`
  font-size: 22px;
  margin: 0;
  line-height: 1;
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 8px;
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
  height: 40vh;
  max-height: 400px;
  min-height: 260px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
`;

const MapControl = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  gap: 12px;
  z-index: 10;
`;

const FloatingButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    background: #f0f0f0;
  }
`;

const MapOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 14px;
  font-weight: 500;
  z-index: 10;
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

const LoadingMsg = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #555;
`;