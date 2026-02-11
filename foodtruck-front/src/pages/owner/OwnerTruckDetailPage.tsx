import { truckApi } from "@/apis/truck/truck.api";
import Navibar from "@/components/layouts/Navibar";
import KakaoMap from "@/components/map/KakaoMap";
import TruckMenuManager from "@/components/menu/TruckMenuManager";
import ScheduleManager from "@/components/schedule/scheduleManager";
import TruckCreateModal from "@/components/truck/TruckModal";
import type { TruckDetailResponse, TruckUpdateRequest } from "@/types/truck/truck.dto";
import type { TruckFormData } from "@/types/truck/truck.type";
import { getErrorMsg } from "@/utils/error";
import { getTruckStatus } from "@/utils/TruckStatus";
import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

function OwnerTruckDetailPage() {
  const { truckId } = useParams();
  const [truck, setTruck] = useState<TruckDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [center, setCenter] = useState<{lat: number, lng: number} | null>(null)
  const [isOpen, setIsOpen] = useState(false);

  if (!truckId) return null;

  const fetchTruck = React.useCallback(
    async () => {
      try {
        setLoading(true);
  
        const res = await truckApi.getTruckById(Number(truckId));
  
        setTruck(res);
        setError(null);
      } catch (e) {
        setError(getErrorMsg(e));
      } finally {
        setLoading(false);
      }
    }, [truckId]);

  useEffect(() => {
    fetchTruck();
  }, [fetchTruck]);

  useEffect(() => {
    if(!truck) return;

    if(truck.schedules.length > 0) {
      setCenter({
        lat: truck.schedules[0].latitude,
        lng: truck.schedules[0].longitude
      });

      return;
    }

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },

        () => {
          setCenter({
            lat: 35.15776,
            lng: 129.05657
          })
        }
      )
    }
  }, [truck])

  const handleStatusToggle = async () => {
    if(!truck) return;

    const newStatus = truck.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    setTruck({...truck, status: newStatus});

    try {
      await truckApi.updateTruckStatus(truck.id, {status: newStatus});
      toast.success(
        `${newStatus === "ACTIVE" ? "OPEN" : "CLOSE"}로 변경되었습니다.`
      );
    } catch (e) {
      setTruck({...truck, status: truck.status});
      alert(getErrorMsg(e));
    }
  }

  const handleTruckUpdate = async (data: TruckFormData) => {
    if(!truck) return;

    try {
      await truckApi.updateTruck(truck.id, data);
      toast.success("트럭 정보가 수정되었습니다.");

      fetchTruck();
    } catch (e) {
      alert(getErrorMsg(e));
    }
  }

  if (loading) return <Loading>트럭 정보 불러오는 중...</Loading>;
  if (error || !truck) return <Error>{error}</Error>;

  const markers = truck.schedules.map((schedule) => ({
    lat: schedule.latitude,
    lng: schedule.longitude,
  }));

  const truckStatus = getTruckStatus(truck.status);

  return (
    <Container>
      <Header>
        <HeaderRow>
          <NameStatusRow>
            <TruckName>{truck.name}</TruckName>
            <Status style={{ backgroundColor: truckStatus.color }}>
              {truckStatus.label}
            </Status>
          </NameStatusRow>

          <Actions>
            <EditButton onClick={() => setIsOpen(true)}>
              수정
            </EditButton>

            <ToggleButton 
              active={truck.status === "ACTIVE"} 
              onClick={handleStatusToggle}
            />
          </Actions>
        </HeaderRow>

          {truck.cuisine && <Cuisine>{truck.cuisine}</Cuisine>}
      </Header>

      {isOpen && truck && (
        <TruckCreateModal 
          open={isOpen}
          onClose={() => setIsOpen(false)}
          initialValue={{name: truck.name, cuisine: truck.cuisine}}
          onSubmit={handleTruckUpdate}
        />
      )}

      <Section>
        <SectionTitle>위치</SectionTitle>
        <MapWrapper>
          {center ? (
            <KakaoMap center={center} markers={markers} />
          ) : (
            <Loading>현재 위치 확인 중...</Loading>
          )}
        </MapWrapper>
      </Section>

      <Section>
        <SectionTitle>메뉴 관리</SectionTitle>
        <TruckMenuManager
          truckId={truck.id}
          menuList={truck.menu}
          onUpdate={fetchTruck}
        />
      </Section>

      <Section>
        <SectionTitle>스케줄 관리</SectionTitle>
        <ScheduleManager 
          truckId={truck.id}
          schedules={truck.schedules}
          onUpdate={fetchTruck}
        />
      </Section>
    </Container>
  );
}

export default OwnerTruckDetailPage;

const Container = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NameStatusRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

const TruckName = styled.h1`
  font-size: 22px;
  margin: 0;
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 12px;
  text-align: center;
  color: white;
  white-space: nowrap;
`;

const ToggleButton = styled.button<{active: boolean}>`
  position: relative;
  width: 50px;
  height: 24px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: ${({active}) => (active ? "#4caf50" : "#ccc")};
  transition: background 0.3s;

  &:focus {
    outline: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({active}) => (active ? "26px" : "2px")};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: left 0.3s;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const EditButton = styled.button`
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  color: white;
  background: #444;
  

  &:hover {
    background: #d0d0d0;
    color: #222;
  }
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

const MapWrapper = styled.div`
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
`;

const Loading = styled.div`
  font-size: 14px;
  color: #555;
`;

const Error = styled.div`
  font-size: 14px;
  color: red;
`;
