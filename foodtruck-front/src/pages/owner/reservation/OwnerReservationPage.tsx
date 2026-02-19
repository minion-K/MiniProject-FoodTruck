import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import ReservationTab from "./ReservationTab";
import OrderTab from "./OrderTab";
import ReservationDetailModal from "./ReservationDetailModal";
import { type TruckDetailResponse, type TruckListResponse } from "@/types/truck/truck.dto";
import { truckApi } from "@/apis/truck/truck.api";
import { getErrorMsg } from "@/utils/error";
import { DateAndHour, formatDateTime } from "@/utils/date";


function OwnerReservationPage() {
  const [activeTab, setActiveTab] = useState<"reservation" | "order">("reservation");
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [trucks, setTrucks] = useState<TruckListResponse>([]);
  const [selectedTruckId, setSelectTruckId] = useState<number | null>(null);
  const [truckDetail, setTruckDetail] = useState<TruckDetailResponse | null>(null);
  const [selectedScheduleId, setSelectScheduleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
              {formatDateTime(schedule.startTime)} ~{""} 
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
          scheduleId={selectedScheduleId}
          onSelect={setSelectedReservation}
        />
      )}

      {activeTab === "order" && selectedScheduleId && (
        <OrderTab 
          scheduleId={selectedScheduleId}
        />
      )}

      {selectedReservation && (
        <ReservationDetailModal 
          data={selectedReservation}
          onClose={() => setSelectedReservation(null)}
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
  background: ${({active}) => active ? "#555" : "#eee"};
  color: ${({active}) => active ? "white" : "black"};
  border-radius: 4px;

  &:hover {
    background: ${({active}) => active ? "#555" : "#ddd"};
  }
`;

const Table = styled.table`
  width: 100%;
`;

const Th = styled.th`
  border-bottom: 2px solid #ccc;
  text-align: left;
  padding: 8px;
`;

const Td = styled.td`
  border-bottom: 1px solid #eee;
  padding: 8px;
`;

const ActionButton = styled.button`
  padding: 4px 8px;
  margin-right: 5px;
  font-size: 12px;
  cursor: pointer;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5) ;
`;

const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 400px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  transform: translate(-50%, -50%);
`;