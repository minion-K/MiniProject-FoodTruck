import { truckApi } from '@/apis/truck/truck.api';
import KakaoMap from '@/components/map/KakaoMap';
import Trucks from '@/components/truck/Trucks';
import type { TruckListResponse } from '@/types/truck/truck.dto';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'

function TruckList() {
  const [trucks, setTrucks] = useState<TruckListResponse>([]);
  useEffect(() => {
    truckApi.getTruckList().then(setTrucks);
  }, []);
  
  const center = {
    lat: 35.15776,
    lng: 129.05657
  };

  const markers = trucks
    .filter((truck): truck is typeof truck & {
      latitude: number;
      longitude: number;
    } => truck.latitude !== null && truck.longitude !== null)
    .map(truck => ({
      id: truck.id,
      lat: truck.latitude,
      lng: truck.longitude,
    }));

  return (
      <Container>
        <MapWrapper>
          <KakaoMap 
            center={center}
            markers={markers}
          />
        </MapWrapper>

        <ListWrapper>
          <Trucks />
        </ListWrapper>
      </Container>
  )
}

export default TruckList

const Container = styled.div`
  display: flex;
  gap: 10px;
  height: 100%;
`;

const MapWrapper = styled.div`
  flex: 1;
  min-height: 400px;
`;

const ListWrapper = styled.div`
  flex: 1;
`;