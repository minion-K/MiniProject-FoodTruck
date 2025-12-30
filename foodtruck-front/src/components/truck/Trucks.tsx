import { truckApi } from '@/apis/truck/truck.api';
import type { TruckListResponse } from '@/types/truck/truck.dto'
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'
import TruckCard from './TruckCard';
import { useNavigate } from 'react-router-dom';

function Trucks() {
  const [trucks, setTrucks] = useState<TruckListResponse>([]);
  const navigate = useNavigate();

  useEffect(() => {
    truckApi.getTruckList().then(setTrucks);
  } ,[]);

  return (
    <List>
      {trucks.map(truck => (
        <Item
          key={truck.id}
          onClick={() => navigate(`/trucks/${truck.id}`)}
        >
          <TruckCard 
            name={truck.name}
            cuisine={truck.cuisine}
            status={truck.status}
            location={truck.locationSummary}
          />
        </Item>
      ))}
    </List>
  )
}

export default Trucks

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Item = styled.div`
  cursor: pointer;
`;