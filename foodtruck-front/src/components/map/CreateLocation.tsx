import { locationApi } from '@/apis/location/location.api';
import type { LocationDetailResponse } from '@/types/location/location.dto'
import { getErrorMsg } from '@/utils/error';
import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react'
import KakaoMap from './KakaoMap';
import SearchInput from '../common/SearchInput';
import { Autocomplete, TextField } from '@mui/material';

interface Props {
  initialValue?: LocationDetailResponse | null;
  onSuccess: (location: LocationDetailResponse) => void;
  onClose: () => void;
}

interface Place {
  place_name: string;
  road_address_name?: string;
  address_name: string;
  x: string;
  y: string;
}

function CreateLocation({initialValue, onSuccess, onClose}: Props) {
  const isEdit = !!initialValue;

  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [name, setName] = useState(initialValue?.name ?? "");
  const [address, setAddress] = useState(initialValue?.address ?? "");
  const [center, setCenter] = useState(
    initialValue
      ? {lat: initialValue.latitude, lng: initialValue.longitude}
      : {lat: 37.5665, lng: 126.9780}
  );
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [inputValue, setInputValue] = useState<string>("");
  const [locations, setLocations] = useState<Place[]>([]);
  const searchRef = useRef<any>(null);

  useEffect(() => {
    if(isEdit) {
      setMapLoading(false);
      return;
    }

    if(!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords;

        setCenter({lat: latitude, lng: longitude});
        setLat(latitude);
        setLng(longitude);
        setMapLoading(false);
      },

      () => {
        alert("위치 정보를 가져올 수 없습니다.");
        setMapLoading(false);
      },

      {enableHighAccuracy: true}
    );
  }, [isEdit])

  useEffect(() =>{
    if(!initialValue) return;

    setLat(initialValue.latitude);
    setLng(initialValue.longitude);
    setName(initialValue.name);
    setAddress(initialValue.address ?? "");
    setCenter({
      lat: initialValue.latitude,
      lng: initialValue.longitude
    });
  }, [initialValue]);

  useEffect(() => {
    if(!window.kakao || !window.kakao.maps) return;

    searchRef.current = new window.kakao.maps.services.Places();
  }, [])

  useEffect(() => {
    if(!inputValue.trim()) {
      setLocations([]);
      return;
    }

    if(!searchRef.current) return;

    const delay = setTimeout(() => {
      searchRef.current.keywordSearch(inputValue, (data: any, status: any) => {
        if(status === window.kakao.maps.services.Status.OK) {
          setLocations(data);
        }
      });
    }, 300);

    return () => clearTimeout(delay);
  }, [inputValue])

  const handleMapClick = (lat: number, lng: number) => {
    setLat(lat);
    setLng(lng);
    setCenter({lat, lng});

    if(!window.kakao || !window.kakao.maps) return;

    const geo = new window.kakao.maps.services.Geocoder();
    geo.coord2Address(lng, lat, (result: any, status: any) => {
      if(status === window.kakao.maps.services.Status.OK && result[0]) {
        setAddress(result[0].road_address?.address_name ||  result[0].address.address_name);
      }
    });
  };

  const handleSubmit = async () => {
    if(!lat || !lng || !name.trim()) {
      alert("지도에서 위치를 선택하고 이름을 입력해주세요");

      return;
    } 

    try {
      setLoading(true);

      let res;
      if(isEdit && initialValue) {
        res = await locationApi.updateLocation(initialValue.id, {
          name,
          address: address || null,
          latitude: lat,
          longitude: lng
        });

      } else {
        res = await locationApi.createLocation({
          name,
          address: address || null,
          latitude: lat,
          longitude: lng
        });
      }

      onSuccess(res);
    } catch (e) {
      alert(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };

  const handleMoveTruck = () => {
    if(!lat || !lng) return;
    setCenter({lat, lng})
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>{isEdit ? "위치 수정" : "신규 위치 등록"}</Title>

        <Autocomplete 
          options={locations}
          noOptionsText="검색 결과 없음"
          getOptionLabel={option => 
            option.place_name  +
              (option.road_address_name 
                ? ` (${option.road_address_name})` 
                : "")
          }
          inputValue={inputValue}
          onInputChange={(e, newInputValue) => setInputValue(newInputValue)}
          onChange={(e, newValue) => {
            if(!newValue) return;

            const lat = Number(newValue.y);
            const lng = Number(newValue.x);

            setCenter({lat, lng});
            setLat(lat);
            setLng(lng);
            setAddress(
              newValue.road_address_name || newValue.address_name
            )
          }}
          renderOption={(props, option) => (
            <li {...props}>
              <div style={{display: "flex", flexDirection: "column"}}>
                <span style={{fontWeight: 600}}>
                  {option.place_name}
                </span>
                <span style={{fontSize: 12, color: "#999"}}>
                  {option.road_address_name || option.address_name}
                </span>
              </div>
            </li>
          )}
          renderInput={(params) => (
            <StyledTextField 
              {...params}
              placeholder="장소 또는 주소 검색"
              size="small"
            />
          )}
        />

        <MapWrapper>
          {mapLoading ? (
            <Loading>위치 불러오는 중...</Loading>
          ) : (
            <>
              <KakaoMap 
                center={center}
                markers={lat && lng ? [{lat, lng, isActive: true}] : []}
                level={4}
                onClick={handleMapClick}
              />
              <MapControl>
                <FloatingButton onClick={handleMoveTruck}>📍</FloatingButton>
              </MapControl>
            </>
          )}
        </MapWrapper>

        <Field>
          <Label>위치명</Label>
          <Input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예) 서면 1번 출구 앞"
          />
        </Field>

        <Field>
          <Label>주소 (선택)</Label>
          <Input 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="예) 부산광역시 부산진구 ..."
          />
        </Field>

        <Actions>
          <CancelButton type="button" onClick={onClose}>취소</CancelButton>
          <SubmitButton onClick={handleSubmit} disabled={loading}>
            {isEdit ? "수정" : "등록"}
          </SubmitButton>
        </Actions>
      </Modal>

    </Overlay>
  )
}

export default CreateLocation

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
`;

const Modal = styled.div`
  width: 600px;
  max-width: 90vw;
  height: 80vh;
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

const MapWrapper = styled.div`
  width: 100%;
  height: 350px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #eee;
  position: relative;
`;

const MapControl = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  gap: 12px;
  z-index: 10;
`;

const FloatingButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    background: #f0f0f0;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  color: #555;
`;

const Input = styled.input`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #ff6b00;
  }
`;

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: #ff6b00;
    }
  }

  & .MuiInputBase-input {
    font-size: 13px;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

const CancelButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: #eee;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: #ff6b00;
  color: white;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: pointer;
  }
`;

const Loading = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
`;
