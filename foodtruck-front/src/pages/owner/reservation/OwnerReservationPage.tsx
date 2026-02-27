import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import ReservationTab from "./ReservationTab";
import OrderTab from "./OrderTab";
import ReservationDetailModal from "./ReservationDetailModal";
import { type TruckDetailResponse, type TruckListResponse } from "@/types/truck/truck.dto";
import { truckApi } from "@/apis/truck/truck.api";
import { getErrorMsg } from "@/utils/error";
import { formatDateTime } from "@/utils/date";


function OwnerReservationPage() {
  const [activeTab, setActiveTab] = useState<"reservation" | "order">("reservation");
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
  const [trucks, setTrucks] = useState<TruckListResponse>([]);
  const [selectedTruckId, setSelectTruckId] = useState<number | null>(null);
  const [truckDetail, setTruckDetail] = useState<TruckDetailResponse | null>(null);
  const [selectedScheduleId, setSelectScheduleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchTrucks = async () => {
      try {
        setLoading(true);

        const res = await truckApi.getOwnerTruckList();
        setTrucks(res);

        if(res.length > 0) {
          setSelectTruckId(res[0].id);
        }
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

        if(res.schedules.length > 0) {
          setSelectScheduleId(res.schedules[0].scheduleId);
        }
      } catch (e) {
        alert(getErrorMsg(e));
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [selectedTruckId])

  return (
    <Container>
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
        >
          {truckDetail?.schedules.map(schedule => (
            <option 
              key={schedule.scheduleId}
              value={schedule.scheduleId}
            >
              {formatDateTime(schedule.startTime)} ~ {""} 
              {formatDateTime(schedule.endTime)}
            </option>
          ))}
        </Select>
      </DropdownContainer>

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

      {activeTab === "reservation" && selectedScheduleId && (
        <ReservationTab
          key={refreshKey}
          scheduleId={selectedScheduleId}
          onSelect={id =>setSelectedReservationId(id)}
        />
      )}

      {activeTab === "order" && selectedScheduleId && (
        <OrderTab 
          scheduleId={selectedScheduleId}
        />
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
  padding: 20px;
`;

const DropdownContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Select = styled.select`
  padding: 6px;
  font-size: 14px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const Tab = styled.button<{active?: boolean}>`
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  background: ${({active}) => active ? "var(--primary)" : "#f3f4f6"};
  color: ${({active}) => active ? "white" : "#374151"};
  border-radius: 4px;

  &:hover {
    background: ${({active}) => active ? "#4338ca" : "#e5e7eb"};
  }
`;