import { truckApi } from "@/apis/truck/truck.api";
import KakaoMap from "@/components/map/KakaoMap";
import Trucks from "@/components/truck/Trucks";
import type { TruckListResponse } from "@/types/truck/truck.dto";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";

function TruckList() {
  const [trucks, setTrucks] = useState<TruckListResponse>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const res = await truckApi.getTruckList();
        setTrucks(res);
      } catch (e) {
        setError(getErrorMsg(e));
      } finally {
        setLoading(false);
      }
    };

    fetchTrucks();
  }, []);

  const center = {
    lat: 35.15776,
    lng: 129.05657,
  };

  const markers = trucks
    .filter(
      (
        truck,
      ): truck is typeof truck & {
        latitude: number;
        longitude: number;
      } => truck.latitude !== null && truck.longitude !== null,
    )
    .map((truck) => ({
      id: truck.id,
      lat: truck.latitude,
      lng: truck.longitude,
    }));

  if (loading) return <LoadingMsg>트럭 내역 불러오는 중...</LoadingMsg>;
  if (error) return <ErrorMsg>{error}</ErrorMsg>;

  return (
    <Container>
      <Header>트럭지도 & 목록</Header>

      <Content>
        <MapWrapper>
          <KakaoMap center={center} markers={markers} />
        </MapWrapper>

        <ListWrapper>
          <Trucks trucks={trucks} />
        </ListWrapper>
      </Content>
    </Container>
  );
}

export default TruckList;

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  background-color: #f5f5f5;
`;

const Header = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #333;
`;

const Content = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;
`;

const MapWrapper = styled.div`
  flex: 2;
  min-height: 400px;
  border-radius: 8px;
  overflow: hidden;
`;

const ListWrapper = styled.div`
  flex: 1.2;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px;
  background-color: #fafafa;
  border-radius: 8px;
`;

const LoadingMsg = styled.div``;

const ErrorMsg = styled.div`
  color: red;
`;
