import type { TruckListItemResponse } from "@/types/truck/truck.dto";
import styled from "@emotion/styled";
import TruckCard from "./TruckCard";
import { useNavigate } from "react-router-dom";
import React from "react";

interface Props {
  trucks: TruckListItemResponse[];
  urlPrefix?: string;
}

function Trucks({ trucks, urlPrefix = "" }: Props) {
  const navigate = useNavigate();

  if(trucks.length === 0) return <EmptyText>등록된 트럭이 없습니다.</EmptyText>

  return (
    <List>
      {trucks?.map((truck) => (
        <Item
          key={truck.id}
          onClick={() => navigate(`${urlPrefix}/trucks/${truck.id}`)}
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
  );
}

export default React.memo(Trucks);

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Item = styled.div`
  cursor: pointer;
`;

const EmptyText = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-size: 14px;
`;
