import { truckApi } from "@/apis/truck/truck.api";
import KakaoMap from "@/components/map/KakaoMap";
import TruckModal from "@/components/truck/TruckModal";
import Trucks from "@/components/truck/Trucks";
import type { TruckCreateRequest, TruckListResponse, TruckUpdateRequest } from "@/types/truck/truck.dto";
import type { TruckFormData, TruckStatus } from "@/types/truck/truck.type";
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
  flex-direction: column;
  flex: 1;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 8px;
  background: #fafafa;
  border-radius: 8px;
  overflow-y: auto;
  height: 100%;
`;

const LoadingMsg = styled.div`
  font-size: 14px;
`;

const ErrorMsg = styled.div`
  font-size: 14px;
  color: red;
`;
