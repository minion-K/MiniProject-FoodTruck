import { truckApi } from "@/apis/truck/truck.api";
import KakaoMap from "@/components/map/KakaoMap";
import TruckMenuManager from "@/components/menu/TruckMenuManager";
import ScheduleManager from "@/components/schedule/ScheduleManager";
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
  
  const navigate = useNavigate();

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

  const handleDelete = async () => {
    if(!truck) return;

    if(!confirm("해당 트럭을 삭제하시겠습니까?")) return;

    try {
      await truckApi.deleteTruck(truck.id);

      toast.success("트럭이 삭제되었습니다.", {icon: "🗑️"});
      navigate("/owner/trucks");
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
            <Status
              style={{ backgroundColor: truckStatus.color }}
              onClick={handleStatusToggle}
            >
              {truckStatus.label}
            </Status>
          </NameStatusRow>

          <Actions>
            <EditButton onClick={() => setIsOpen(true)}>
              수정
            </EditButton>

            <DeleteButton onClick={handleDelete}>
              삭제
            </DeleteButton>
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
  cursor: pointer;
  transition: transform 0.15s ease, filter 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.08);
  }

  &:active {
    transform: translateY(0);
    filter: brightness(0.95);
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EditButton = styled.button`
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid #ddd;
  border-radius: 999px;
  cursor: pointer;
  color: #444;
  background: white;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
    color: #111;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const DeleteButton = styled.button`
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 999px;
  border: 1px solid #ff4d4f;
  cursor: pointer;
  background: white;
  color: #ff4d4f;
  transition: all 0.2s ease;

  &:hover {
    background: #ff4d4f;
    color: white;
  }

  &:active {
    transform: translateY(1px);
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
