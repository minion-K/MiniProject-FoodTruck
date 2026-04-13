import { locationApi } from '@/apis/location/location.api';
import { type LocationDetailResponse, type LocationListResponse } from '@/types/location/location.dto';
import { getErrorMsg } from '@/utils/error';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'
import CreateLocation from './CreateLocation';
import toast from 'react-hot-toast';

interface Props {
  onUpdated: () => void;
  onClose: () => void
}

function LocationManageModal({ onUpdated, onClose}: Props) {
  const [locations, setLocations] = useState<LocationListResponse>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editLocation, setEditLocation] = useState<LocationDetailResponse | null>(null);

  const fetchLocations = async () => {
    try {
      const res = await locationApi.getLocationList();

      setLocations(res);
    } catch (e) {
      alert(getErrorMsg(e));
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [])

  const handleAdd = () => {
    setEditLocation(null);
    setOpen(true);
  };

  const handleEdit = async (locationId: number) => {
    try {
      setLoading(true);

      const res = await locationApi.getLocationById(locationId);

      setEditLocation(res);
      setOpen(true);
    } catch (e) {
      alert(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (locationId: number) => {
    if(!confirm("해당 위치를 삭제하겠습니까?")) return;

    try {
      setLoading(true);

      await locationApi.deleteLocation(locationId);

      toast.success("위치가 삭제되었습니다.", {icon: "🗑️"});

      fetchLocations();
      onUpdated();
    } catch (e) {
      alert(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setOpen(false);
    setEditLocation(null);

    if(editLocation) {
      toast.success("위치가 수정되었습니다.");
    } else {
      toast.success("위치가 등록되었습니다.")
    }

    fetchLocations();
    onUpdated();
  }

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>위치 관리</Title>

        <List>
          {locations.map(location => (
            <Item key={location.id}>
              <Info>
                <Name>{location.name}</Name>
                {location.address && (
                  <Address>{location.address}</Address>
                )}
              </Info>

              <ItemActions>
                <EditButton onClick={() => handleEdit(location.id)}>
                  수정
                </EditButton>

                <DeleteButton
                  onClick={() => handleDelete(location.id)}
                  disabled={loading}
                >
                  삭제
                </DeleteButton>

              </ItemActions>
            </Item>
          ))}

          {locations.length === 0 && (
            <Empty>등록된 위치가 없습니다.</Empty>
          )}
        </List>

        <SubButton onClick={handleAdd}>
          + 신규 위치 등록
        </SubButton>

        <Actions>
          <CancelButton onClick={onClose}>닫기</CancelButton>
        </Actions>
      </Modal>

      {open && (
        <CreateLocation 
          initialValue={editLocation}
          onSuccess={handleSuccess}
          onClose={() => {
            setOpen(false);
            setEditLocation(null) 
          }}
        />
      )}
    </Overlay>
  )
}

export default LocationManageModal

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
`;

const Modal = styled.div`
  width: 380px;
  max-width: 80vh;
  background: white;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h2`
  font-size: 18px;
  margin: 0;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  overflow-y: auto;
  max-height: 300px;
  padding-right: 5px
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 8px 10px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-width: 200px;
`;

const Name = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #222;
  line-height: 1.2;
`;

const Address = styled.div`
  font-size: 12px;
  color: #777;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemActions = styled.div`
  display: flex;
  gap: 8px;
`;

const EditButton = styled.button`
  border: none;
  background: none;
  color: #555;
  font-size: 13px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  border: none;
  background: none;
  color: #ff4d4f;
  font-size: 13px;
  cursor: pointer;
`;

const Empty = styled.div`
  font-size: 13px;
  color: #999;
  text-align: center;
  padding: 20px 0;
`;

const SubButton = styled.button`
  background: none;
  border: none;
  color: #ff6b00;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: #eee;
  cursor: pointer;
`;