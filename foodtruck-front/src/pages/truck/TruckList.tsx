import { truckApi } from "@/apis/truck/truck.api";
import SearchInput from "@/components/common/SearchInput";
import KakaoMap from "@/components/map/KakaoMap";
import Trucks from "@/components/truck/Trucks";
import type { TruckListItemResponse } from "@/types/truck/truck.dto";
import type { TruckStatus } from "@/types/truck/truck.type";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import React, { useEffect, useMemo, useRef, useState } from "react";

function TruckList() {
  const [trucks, setTrucks] = useState<TruckListItemResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showActive, setShowActive] = useState(false);
  const [keyword, setKeyword] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [sortType, setSortType] = useState<"DISTANCE" | "STATUS">("DISTANCE");
  const [statusFilter, setStatusFilter] = useState<TruckStatus | "ALL">("ALL");
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
  
  const fetchTrucks = async (nextPage: number) => {
    try {
      const res = await truckApi.getTruckList({
        page: nextPage,
        size: 5,
        keyword: searchKeyword || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter
      });
      let fetchedTrucks = res.content.filter(
        truck => truck.status !== "SUSPENDED"
      );

      if(nextPage === 0) {
        setTrucks(fetchedTrucks);
      } else {
        setTrucks(prev => [...prev, ...fetchedTrucks]);
      }
      setTotalPage(res.totalPage);
      setHasMore(nextPage + 1 < res.totalPage);

    } catch (e) {
      setError(getErrorMsg(e));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if(!myLocation) return;

    setLoading(true);
    setPage(0);
    fetchTrucks(0);
  }, [myLocation, searchKeyword]);

  const sortedTruck = React.useMemo(() => {
    let sorted = [...trucks];

    sorted.sort((a, b) => {
      if(sortType === "STATUS") {
        const prirority = {ACTIVE: 0, INACTIVE: 1};
        const statusDiff = 
          (prirority[a.status as "ACTIVE" | "INACTIVE"] ?? 99)
          - (prirority[b.status as "ACTIVE" | "INACTIVE"] ?? 99)

        if(statusDiff !== 0) return statusDiff
      }

      if(myLocation) {
        return (
          getDistance(myLocation.lat, myLocation.lng, a.latitude!, a.longitude!)
          - getDistance(myLocation.lat, myLocation.lng, b.latitude!, b.longitude!)
        );
      }

        return 0;
    });

    return sorted;
  }, [trucks, sortType, myLocation]);

  const visibleTrucks = React.useMemo(() => {
    return showActive 
    ? sortedTruck.filter(truck => truck.isActive) 
    : sortedTruck;
  }, [sortedTruck, showActive]);

  const isReady = myLocation !== null && !loading;

  useEffect(() => {
    if(loading || loadingMore) return;
    if(!hasMore) return;;

    if(visibleTrucks.length < 5) {
      const nextPage = page + 1;
      setLoadingMore(true);
      setPage(nextPage);
      fetchTrucks(nextPage);
    }
  }, [visibleTrucks]);

  useEffect(() => {
    if(listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [showActive, sortType, searchKeyword]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCenter({lat, lng});
        setMyLocation({lat, lng});
      },
      (e) => {
        alert(getErrorMsg(e));
      },
    )
  }, []);

  const markers = visibleTrucks
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
    setSearchKeyword(keyword);
    setLoading(true);

    if(listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if(!hasMore || loadingMore) return;

    if(target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
      setLoadingMore(true);
      fetchTrucks(page + 1);
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

        <ListWrapper>
          <SearchWrapper>
            <Select
              value={sortType}
              onChange={(e) => setSortType(e.target.value as ("DISTANCE" | "STATUS"))}
            >
              <option value="DISTANCE">거리순</option>
              <option value="STATUS">상태순</option>
            </Select>
            <SearchInput 
              value={keyword}
              onChange={setKeyword}
              onSearch={handleSearch}
            />
          </SearchWrapper>
          <ListScrollArea onScroll={handleScroll} ref={listRef}>
            {!isReady ? (
              <LoadingMsg>트럭 내역 불러오는 중...</LoadingMsg>
            ) : (trucks.length === 0) ? (
              <Empty>등록된 트럭이 없습니다.</Empty>
            ) : (
              <Trucks trucks={visibleTrucks} />
            )}
          </ListScrollArea>
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
  display: flex;
  flex-direction: column;
  padding: 8px;
  background-color: #fafafa;
  border-radius: 8px;
  min-height: 0;
  `;

const SearchWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 5;
  background: #fafafa;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Select = styled.select`
  height: 36px;
  padding: 0 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: white;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #e65a00;
  }
`;

const ListScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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

const Empty = styled.div`
  text-align: center;
  color: #888;
  margin-top: 80px;
`;
