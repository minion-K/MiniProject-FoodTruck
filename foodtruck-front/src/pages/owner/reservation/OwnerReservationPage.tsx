import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import ReservationTab from "./ReservationTab";
import OrderTab from "./OrderTab";
import ReservationDetailModal from "./ReservationDetailModal";
import { type TruckDetailResponse, type TruckListItemResponse } from "@/types/truck/truck.dto";
import { truckApi } from "@/apis/truck/truck.api";
import { getErrorMsg } from "@/utils/error";
import { formatDateTime } from "@/utils/date";
import { useLocation } from "react-router-dom";
import { getTruckStatus } from "@/utils/TruckStatus";
import { getScheduleStatus } from "@/utils/ScheduleStatus";


function OwnerReservationPage() {
  const location = useLocation();
  const {selectedTruckId: initTruckId, selectedScheduleId: initScheduleId, activeTab: initTab} = location.state || {};
  const [activeTab, setActiveTab] = useState<"reservation" | "order">(initTab ?? "reservation");
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
  const [trucks, setTrucks] = useState<TruckListItemResponse[]>([]);
  const [selectedTruckId, setSelectTruckId] = useState<number | null>(initTruckId ?? null);
  const [truckDetail, setTruckDetail] = useState<TruckDetailResponse | null>(null);
  const [selectedScheduleId, setSelectScheduleId] = useState<number | null>(initScheduleId ?? null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(0);

  const fetchTrucks = async () => {
      try {
        setLoading(true);

        const res = await truckApi.getOwnerTruckList({
          page,
          size: 100
        });
        setTrucks(res.content);

        const truckIdSelect = 
          initTruckId && res.content.some(t => t.id === initTruckId)
            ? initTruckId
            : res.content.length > 0
            ? res.content[0].id
            : null;
        
        setSelectTruckId(prev => {
          if(prev !== null) return prev;

          return truckIdSelect;
        });
      } catch (e) {
        alert(getErrorMsg(e));
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchTrucks();
  }, []);

  useEffect(() => {
    if(!selectedTruckId) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);

        const res = await truckApi.getTruckById(selectedTruckId);
        setTruckDetail(res);

        const scheduleSelect = 
          initScheduleId && res.schedules.some(s => s.scheduleId === initScheduleId)
            ? initScheduleId
            : res.schedules.length > 0
            ? res.schedules[0].scheduleId
            : null;

        setSelectScheduleId(prev => {
          if(prev !== null) return prev;

          return scheduleSelect;
        });
      } catch (e) {
        alert(getErrorMsg(e));
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [selectedTruckId]);

  const selectedSchedule = truckDetail?.schedules.find(
    schedule => schedule.scheduleId === selectedScheduleId
  );

  const status = getScheduleStatus(selectedSchedule?.status);
  if(loading || !truckDetail) {
    return <Container>로딩 중...</Container>
  }

  return (
    <Container>
      <HeaderRow>
        <Title>예약 · 주문관리</Title>
      </HeaderRow>

      <DropdownContainer>
        <Select
          value={selectedTruckId ?? ""}
          onChange={(e) => setSelectTruckId(Number(e.target.value))}
        >
          {trucks.map(truck => (
            <option key={truck.id} value={truck.id}>
              {truck.name} ({truck.cuisine})
            </option>
          ))}
        </Select>
        <Select
          value={selectedScheduleId ?? ""}
          onChange={(e) => setSelectScheduleId(Number(e.target.value))}
          disabled={!truckDetail?.schedules.length}
        >
          {truckDetail?.schedules.length === 0 ? (
            <option value="">등록된 스케줄 없음</option>
          ) : (
            truckDetail?.schedules.map(schedule => (
              <option
                key={schedule.scheduleId}
                value={schedule.scheduleId}
              >
                {formatDateTime(schedule.startTime, "compact")} ~ {""} 
                {formatDateTime(schedule.endTime, "compact")}
              </option>
            ))
          )}
        </Select>
      </DropdownContainer>
      {selectedSchedule && (
        <SchedulePreview>
          <PreviewTitle>📍 {selectedSchedule.locationName}</PreviewTitle>

          <PreviewTime>
            ⏰ {formatDateTime(selectedSchedule.startTime)} ~ {""}  
            {formatDateTime(selectedSchedule.endTime)}
          </PreviewTime>

          <PreviewBadge
            style={{color: status.color, borderColor: status.color}}
          >
            {status.label}
          </PreviewBadge>
        </SchedulePreview>
      )}

      <Tabs>
        <Tab 
          active={activeTab === "reservation"}
          onClick={() => setActiveTab("reservation")}
        >
          예약
        </Tab>
        <Tab 
          active={activeTab === "order"}
          onClick={() => setActiveTab("order")}
        >
          주문
        </Tab>
      </Tabs>
      {!selectedScheduleId ? (
        <EmptyText>해당 트럭에 등록된 스케줄이 없습니다. 스케줄을 먼저 등록해주세요.</EmptyText>
      ) : (
        <>
          {activeTab === "reservation" && truckDetail && selectedScheduleId && (
            <ReservationTab
              key={refreshKey}
              scheduleId={selectedScheduleId}
              onSelect={id =>setSelectedReservationId(id)}
            />
          )}  
    
          {activeTab === "order" && truckDetail && selectedScheduleId && (
            <OrderTab 
              scheduleId={selectedScheduleId}
              menus={truckDetail.menu}
              truckName={truckDetail.name}
              truckId={selectedTruckId}
            />
          )}
        </>
      )}

      {selectedReservationId !== null && (
        <ReservationDetailModal 
          reservationId={selectedReservationId}
          onClose={() => setSelectedReservationId(null)}
          onUpdated={() => setRefreshKey(prev => prev + 1)}
        />
      )}
    </Container>
  )
}

export default OwnerReservationPage;

const Container = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
`;

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
`;

const Select = styled.select`
  padding: 6px;
  font-size: 14px;
  width: 320px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
`;

const SchedulePreview = styled.div`
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: fit-content;
  max-width: 420px;
`;

const PreviewTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
`;

const PreviewTime = styled.div`
  font-size: 12px;
  color: #666;
`;

const PreviewBadge = styled.div`
  font-size: 11px;
  padding: 2px 8px;
  border: 1px solid;
  border-radius: 999px;
  width: fit-content;
`;
const Tabs = styled.div`
  display: flex;
  gap: 10px;
`;

const Tab = styled.button<{active?: boolean}>`
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
  border: none;
  background: ${({active}) => active ? "#3b82f6" : "#f3f4f6"};
  color: ${({active}) => active ? "white" : "#374151"};
  cursor: pointer;

  &:hover {
    background: ${({active}) => active ? "#2563eb" : "#f3f4f6"}
  }
`;

const EmptyText = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-size: 14px;
`;