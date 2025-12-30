import styled from '@emotion/styled';
import React from 'react'

interface Props {
  name: string;
  cuisine?: string;
  status: string;
  location: string;
}

function TruckCard({name, cuisine, status, location}: Props) {
  return (
    <Card>
      <Header>
        <Name>{name}</Name>
        <Status data-status={status}></Status>
      </Header>

      <Cuisine>{cuisine}</Cuisine>
      <Location>{location}</Location>
    </Card>
  )
}

export default TruckCard

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 14px 16px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;

  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

    &:hover {
      background-color: #f9fbff;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Name = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const Status = styled.span`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 8px;
  background: #eee;

  &[data-status="ACTIVE"] {
    background: #e6f7ec;
    color: #1a7f37;
  }

  &[data-status="INACTIVE"] {
    background: #fef3c7;
    color: #92400e;
  }
`;

const Cuisine = styled.div`
  font-size: 14px;
  color: #555;
`;

const Location = styled.div`
  font-size: 13px;
  color: #888;
`;
