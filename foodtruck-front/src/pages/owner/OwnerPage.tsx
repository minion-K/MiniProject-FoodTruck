import { truckApi } from "@/apis/truck/truck.api";
import KakaoMap from "@/components/map/KakaoMap";
import TruckModal from "@/components/truck/TruckModal";
import Trucks from "@/components/truck/Trucks";
import type { TruckCreateRequest, TruckListResponse, TruckUpdateRequest } from "@/types/truck/truck.dto";
import type { TruckFormData } from "@/types/truck/truck.type";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";

function OwnerPage() {
  const [trucks, setTrucks] = useState<TruckListResponse>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const fetchTruck = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await truckApi.getOwnerTruckList();

      setTrucks(res);
    } catch (e) {
      setError(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTruck();
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

    const handleCreateTruck = async (data: TruckFormData) => {
      await truckApi.createTruck(data);

      setOpen(false);
      fetchTruck();
    };

  if (loading) return <LoadingMsg>내 트럭 내역 불러오는 중...</LoadingMsg>;
  if (error) return <ErrorMsg>{error}</ErrorMsg>;

  return (
    <Container>
      <HeaderRow>
        <Header>내 트럭 관리</Header>
        <AddButton onClick={() => setOpen(true)}>+ 트럭 추가</AddButton>
      </HeaderRow>

      <Content>
        <MapWrapper>
          <KakaoMap center={center} markers={markers} />
        </MapWrapper>

        <ListWrapper>
          <Trucks trucks={trucks} urlPrefix="/owner" />
        </ListWrapper>
      </Content>

      <TruckModal 
        open={open} 
        onClose={() => setOpen(false)}
        onSubmit={handleCreateTruck}
      />
    </Container>
  );
}

export default OwnerPage;

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

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddButton = styled.button`
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 500;
  background-color: #ff6b00;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #e85d00;
  }
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
