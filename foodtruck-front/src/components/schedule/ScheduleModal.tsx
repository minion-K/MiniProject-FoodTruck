import { locationApi } from '@/apis/location/location.api';
import { scheduleApi } from '@/apis/schedule/schdule.api';
import { type LocationListResponse } from '@/types/location/location.dto';
import type { ScheduleCreateRequest, ScheduleUpdateRequest, TruckScheduleItemResponse } from '@/types/schedule/schedule.dto';
import { getErrorMsg } from '@/utils/error';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'
import CreateLocation from '../map/CreateLocation';
import LocationManageModal from '../map/LocationManageModal';
import { DateAndHour, formatHour } from '@/utils/date';

interface Props {
  truckId: number;
  schedule: TruckScheduleItemResponse | null;
  onClose:() => void;
  onSuccess: () => void;
}

function ScheduleModal({truckId, schedule, onClose, onSuccess}: Props) {
  const isEdit = !!schedule;

  const [date, setDate] = useState("");
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [locationId, setLocationId] = useState<number|null>(null);
  const [locations, setLocations] = useState<LocationListResponse>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdviceOpen, setIsAdviceOpen] = useState(false);
  const [maxReservations, setMaxReservations] = useState<number | null>(null);

  const HOURS = Array.from({length: 24}, (_, i) => 
    `${String(i).padStart(2, "0")}:00`
  )

  useEffect(() => {
    if(!schedule) {
      setIsAdviceOpen(false);
      setMaxReservations(null);

      return;
    };

    const fetchDetail = async () => {
      if(schedule){
        try {
          const res = await scheduleApi.getScheduleById(schedule.scheduleId);
    
          const start = new Date(res.startTime);
          const end = new Date(res.endTime);
          const defaultMax = 100;
    
          setDate(start.toISOString().slice(0, 10));
          setStartHour(formatHour(start));
          setEndHour(formatHour(end));
          setLocationId(res.locationId);
          setMaxReservations(res.maxReservations ?? null);
          setIsAdviceOpen(res.maxReservations != null && res.maxReservations !== defaultMax);
        } catch (e) {
          alert(getErrorMsg(e));
        }
      } else {
        setDate("");
        setStartHour("");
        setEndHour("");
        setLocationId(null);
        setMaxReservations(null);
        setIsAdviceOpen(false);
      } 
    };

      fetchDetail();
  }, [schedule]);

  useEffect(() => {
    if(!startHour || !endHour) return;

    if(startHour >= endHour) {
      setEndHour("");
    }
  }, [startHour, endHour])

  const handleSubmit = async () => {
    if(!date || !startHour || !endHour || !locationId) {
      alert("시간과 위치를 지정해주세요");

      return;
    }

    if(startHour >= endHour) {
      alert("종료 시간은 시작 시간 이후여야 합니다.");

      return;
    }

    const startTime = DateAndHour(date, startHour);
    const endTime = DateAndHour(date, endHour);

    try {
      setLoading(true);

      if(isEdit && schedule) {
        const request: ScheduleUpdateRequest = {
          startTime,
          endTime,
          locationId,
          maxReservations: maxReservations ?? undefined
        };

        await scheduleApi.updateSchedule(schedule.scheduleId, request);
      } else {
        const request: ScheduleCreateRequest = {
          startTime,
          endTime,
          locationId,
          maxReservations: maxReservations ?? undefined
        };

        await scheduleApi.createSchedule(truckId, request);
      }

      onSuccess();
    } catch (e) {
      alert(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await locationApi.getLocationList();

        setLocations(res);
      } catch (e) {
        alert(getErrorMsg(e));
      }
    };
    
    fetchLocations();
  }, []);

  return (
    <Overlay>
      <Modal>
        <Title>
          {isEdit ? "스케줄 수정" : "스케줄 추가"}
        </Title>

        <Field>
          <Label>날짜</Label>
          <Input 
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>

        <Field>
          <Label>시간</Label>
          <TimeRow>
            <Select value={startHour} onChange={(e) => setStartHour(e.target.value)}>
              <option value="">시작 시간</option>
              {HOURS.map((hour) => (
                <option key={hour}>{hour}</option>
              ))}
            </Select>
            <span>~</span>
            <Select value={endHour} onChange={(e) => setEndHour(e.target.value)}>
              <option value="">종료 시간</option>
              {HOURS.filter(hour => !startHour || hour > startHour)
                .map((hour) => (
                <option key={hour}>{hour}</option>
              ))}
            </Select>  
          </TimeRow>
        </Field>

        <Field>
          <Label>장소</Label>
            <Select
              value={locationId ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setLocationId(value ? Number(value) : null);
              }
              }
            >
              <option value="">장소 선택</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                  {location.address ? ` (${location.address})` : ""}
                </option>
              ))}
            </Select>

          <LocationWrapper>
            <SubButton onClick={() => setIsOpen(true)}>
              + 신규 위치 등록
            </SubButton>

            <SubButton onClick={() => setIsManageOpen(true)}>
              위치 관리
            </SubButton>
          </LocationWrapper>
        </Field>

        <SubButton 
          onClick={() => setIsAdviceOpen(prev => !prev)}
          style={{alignSelf: "flex-start"}}
        >
          {isAdviceOpen ? "고급 설정 닫기 ▲" : "고급 설정 열기 ▼"}
        </SubButton>

        {isAdviceOpen && (
          <Field>
            <Label>
              최대 예약 수
              <span style={{fontSize: 12, color: "#999", marginLeft: 4}}>
                (미입력 시 기본값 적용: 100)
              </span>
            </Label>
            <Input 
              type="number"
              min={1}
              placeholder="예) 50"
              value={maxReservations ?? ""}
              onChange={(e) => 
                setMaxReservations(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
            />
          </Field>
        )}

        <Actions>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <SubmitButton onClick={handleSubmit} disabled={loading}>
            {isEdit ? "수정" : "등록"}
          </SubmitButton>
        </Actions>
      </Modal>

      {isOpen && (
        <CreateLocation 
          onSuccess={(location) => {
            setLocations(prev => [...prev, location]);
            setLocationId(location.id);
            setIsOpen(false);
          }}
          onClose={() => setIsOpen(false)}
        />
      )}

      {isManageOpen && (
        <LocationManageModal 
          onClose={() => setIsManageOpen(false)}
          onUpdated={async () => {
            const updated = await locationApi.getLocationList();
            setLocations(updated);
          }}
        />
      )}
    </Overlay>

  )
}

export default ScheduleModal

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  width: 300px;
  background: white;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Title = styled.h2`
  font-size: 18px;
  margin: 0;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #555;
`;

const Input = styled.input`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 13px;
  color: #333;

  &[type="date"] {
    font-size: 13px;
  }

  &:focus {
    outline: none;
    border-color: #ff6b00;
  }
`;

const TimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
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
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 13px;
  color: #333;

  &:focus {
    outline: none;
    border-color: #ff6b00;
  }

  option {
    font-size: 13px;
  }
`;

const LocationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SubButton = styled.button`
  margin-top: 6px;
  background: none;
  border: none;
  color: #ff6b00;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
`;