import type { TruckListResponse } from "@/types/truck/truck.dto";
import styled from "@emotion/styled";
import TruckCard from "./TruckCard";
import { useNavigate } from "react-router-dom";

interface Props {
  trucks: TruckListResponse;
  urlPrefix?: string;
}

function Trucks({ trucks, urlPrefix = "" }: Props) {
  const navigate = useNavigate();
  return (
    <List>
      {trucks.map((truck) => (
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

export default Trucks;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Item = styled.div`
  cursor: pointer;
`;
