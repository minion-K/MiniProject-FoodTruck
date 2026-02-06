import { truckApi } from "@/apis/truck/truck.api";
import KakaoMap from "@/components/map/KakaoMap";
import TruckMenuManager from "@/components/menu/TruckMenuManager";
import type { TruckDetailResponse } from "@/types/truck/truck.dto";
import { getErrorMsg } from "@/utils/error";
import { getTruckStatus } from "@/utils/TruckStatus";
import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function OwnerTruckDetailPage() {
  const { truckId } = useParams();
  const [truck, setTruck] = useState<TruckDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!truckId) return;

  const fetchTruck = async () => {
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
  };

  useEffect(() => {
    fetchTruck();
  }, [truckId]);

  if (loading) return <Loading>트럭 정보 불러오는 중...</Loading>;
  if (error || !truck) return <Error>{error}</Error>;

  const center = truck.schedules.length
    ? { lat: truck.schedules[0].latitude, lng: truck.schedules[0].longitude }
    : { lat: 35.15776, lng: 129.05657 };

  const markers = truck.schedules.map((schedule) => ({
    lat: schedule.latitude,
    lng: schedule.longitude,
  }));

  const truckStatus = getTruckStatus(truck.status);

  return (
    <Container>
      <Header>
        <NameStatusRow>
          <TruckName>{truck.name}</TruckName>
          <Status style={{ backgroundColor: truckStatus.color }}>
            {truckStatus.label}
          </Status>
        </NameStatusRow>
        {truck.cuisine && <Cuisine>{truck.cuisine}</Cuisine>}
      </Header>

      <Section>
        <SectionTitle>위치</SectionTitle>
        <MapWrapper>
          <KakaoMap center={center} markers={markers} />
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
