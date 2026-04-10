import { truckApi } from "@/apis/truck/truck.api";
import SearchInput from "@/components/common/SearchInput";
import KakaoMap from "@/components/map/KakaoMap";
import Trucks from "@/components/truck/Trucks";
import type { TruckListItemResponse } from "@/types/truck/truck.dto";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";

function TruckList() {
  const [trucks, setTrucks] = useState<TruckListItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActive, setShowActive] = useState(false);
  const [keyword, setKeyword] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true);
  const [center, setCenter] = useState({
    lat: 35.15776,
    lng: 129.05657,
  })
  const [myLocation, setMyLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const getDistance = (
    lat1: number, lng1: number, 
    lat2: number, lng2: number
  ) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const RADIUS = 6371;
    const disLat = toRad(lat2 - lat1);
    const disLng = toRad(lng2 - lng1);
    const a = Math.sin(disLat / 2) ** 2 + 
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(disLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return RADIUS * c;
  }
  
  const fetchTrucks = async () => {
    try {
      const res = await truckApi.getTruckList({
        page,
        size: 5,
        keyword: keyword || undefined
      });
      let fetchedTrucks = res.content;
      
      if(myLocation) {
        fetchedTrucks = [...fetchedTrucks]
          .sort((a, b) => 
            getDistance(myLocation.lat, myLocation.lng, a.latitude!, a.longitude!)
            - getDistance(myLocation.lat, myLocation.lng, b.latitude!, b.longitude!)
        );
      }

      if(listRef.current && page !== 0) {
        const prevScrollHeight = listRef.current.scrollHeight;
        setTrucks(prev => [...prev, ...fetchedTrucks]);
        
        requestAnimationFrame(() => {
          if(listRef.current) {
            listRef.current.scrollTop = 
            listRef.current.scrollHeight - prevScrollHeight + listRef.current.scrollTop;
          }
        });
      } else {
        setTrucks(fetchedTrucks);
        if(listRef.current) listRef.current.scrollTop = 0;
      }
      
      setTotalPage(res.totalPage);
      setHasMore(page + 1 < res.totalPage);

    } catch (e) {
      setError(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(myLocation !== null) {
      setLoading(true);
      fetchTrucks();
    }
  }, [myLocation, page]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCenter({lat, lng});
        setMyLocation({lat, lng});
      },
      (err) => {
        console.log("위치 가져오기 실패", err);
      },
    )
  }, []);

  const markers = trucks
    .filter(
      (
        truck,
      ): truck is typeof truck & {
        latitude: number;
        longitude: number;
      } => truck.latitude !== null && truck.longitude !== null,
    )
    .filter(truck => showActive ? truck.isActive : true)
    .map((truck) => ({
      lat: truck.latitude,
      lng: truck.longitude,
      isActive: truck.isActive,
      name: truck.name
    }));
  
  const handleMoveMyLocation = () => {
    if(!myLocation) return;
    setCenter({
      lat: myLocation.lat,
      lng: myLocation.lng
    });
  }

  const handleSearch = () => {
    setTrucks([]);
    setPage(0);
    setLoading(true);
    fetchTrucks();

    if(listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if(!hasMore) return;

    if(target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
      setPage(prev => prev + 1);
    }
  }
  
  if (error) return <ErrorMsg>{error}</ErrorMsg>;

  return (
    <Container>
      <Header>트럭지도 & 목록</Header>

      <Content>
        <MapWrapper>
          {myLocation ? (
            <>
              <KakaoMap 
                center={center} 
                markers={markers} 
                myLocation={myLocation}
              />

              <MapControl>
                <FloatingButton 
                  onClick={handleMoveMyLocation}
                  title="내 위치"
                >
                  📍
                </FloatingButton>
                <ToggleWrapper>
                  <span>영업 중</span>
                  <ToggleSwitch>
                    <input 
                      type="checkbox"
                      checked={showActive}
                      onChange={() => setShowActive(prev => !prev)}
                    />
                    <span className="slider" />
                  </ToggleSwitch>
                </ToggleWrapper >
              </MapControl>
            </>

          ) : (
            <LoadingMsg>지도 불러오는 중...</LoadingMsg>
          )}
        </MapWrapper>

        <ListWrapper onScroll={handleScroll} ref={listRef}>
          <SearchInput 
            value={keyword}
            onChange={setKeyword}
            onSearch={handleSearch}
          />
          {loading || (myLocation === null && trucks.length > 0) ? (
            <LoadingMsg>트럭 내역 불러오는 중...</LoadingMsg>
          ) : (
            <Trucks trucks={showActive ? trucks.filter(t => t.isActive) : trucks} />
          )}
          
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
  min-height: 0;
`;

const MapWrapper = styled.div`
  flex: 2;
  min-height: 400px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MapControl = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  gap: 12px;
  background: rgba(255,255,255,0.85);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  padding: 6px 8px;
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

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 6px;

  span {
    font-size: 12px;
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 32px;
  height: 18px;
  cursor: pointer;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span.slider {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #ccc;
    border-radius: 18px;
    transition: 0.2s;
  }

  span.slider::before {
    position: absolute;
    content: "";
    height: 14px;
    width: 14px;
    left: 2px;
    bottom: 2px;
    background: white;
    border-radius: 50%;
    transition: 0.2s;
  }

  input:checked + .slider {
    background: #4caf50;
  }

  input:checked + .slider::before {
    transform: translateX(14px);
  }
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
  min-height: 0;
  overflow-anchor: none;
`;

const LoadingMsg = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #555;
`;

const ErrorMsg = styled.div`
  color: #eb2222;
`;
