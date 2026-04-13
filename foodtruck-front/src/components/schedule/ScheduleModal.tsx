import { locationApi } from '@/apis/location/location.api';
import { scheduleApi } from '@/apis/schedule/schdule.api';
import { type LocationListItemResponse, type LocationListResponse } from '@/types/location/location.dto';
import type { TruckScheduleItemResponse } from '@/types/schedule/schedule.dto';
import { getErrorMsg } from '@/utils/error';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'
import CreateLocation from '../map/CreateLocation';
import LocationManageModal from '../map/LocationManageModal';
import { toKstString } from '@/utils/date';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { Autocomplete, TextField } from '@mui/material';

interface Props {
  truckId: number;
  schedule: TruckScheduleItemResponse | null;
  onClose:() => void;
  onSuccess: () => void;
}

function ScheduleModal({truckId, schedule, onClose, onSuccess}: Props) {
  const isEdit = !!schedule;

  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [locationId, setLocationId] = useState<number|null>(null);
  const [locations, setLocations] = useState<LocationListResponse>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdviceOpen, setIsAdviceOpen] = useState(false);
  const [maxReservations, setMaxReservations] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<LocationListItemResponse | null>(null);

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
    
          setStartTime(start);
          setEndTime(end);
          setLocationId(res.locationId);
          setMaxReservations(res.maxReservations ?? null);
          setIsAdviceOpen(res.maxReservations != null && res.maxReservations !== defaultMax);
        } catch (e) {
          alert(getErrorMsg(e));
        }
      } else {
        setStartTime(null);
        setEndTime(null);
        setLocationId(null);
        setMaxReservations(null);
        setIsAdviceOpen(false);
      } 
    };

      fetchDetail();
  }, [schedule]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await locationApi.getLocationList({inputValue});

        setLocations(res);
      } catch (e) {
        alert(getErrorMsg(e));
      }
    };
    
    fetchLocations();
  }, []);

  useEffect(() => {
    if(!schedule) {
      const today = new Date();

      setStartTime(today);
      setEndTime(today);
    }
  }, [schedule]);

  
  useEffect(() => {
    if(!startTime) return;

    if(endTime && endTime < startTime) {
      setEndTime(startTime);
    }
  }, [startTime]);

  useEffect(() => {
    if(!schedule || locations.length === 0) return;

    const found = locations.find(
      location => location.id === locationId
    );

    if(found) {
      setSelectedLocation(found);
    }
  }, [locations, schedule, locationId]);

  const handleSubmit = async () => {
    if(!startTime || !endTime || !locationId) {
      alert("시간과 위치를 지정해주세요");

      return;
    }

    if(startTime >= endTime) {
      alert("종료 시간은 시작 시간 이후여야 합니다.");

      return;
    }

    try {
      setLoading(true);

      const request = {
        startTime: toKstString(startTime),
        endTime: toKstString(endTime),
        locationId,
        maxReservations: maxReservations ?? undefined
      };

      if(isEdit && schedule) {
        await scheduleApi.updateSchedule(schedule.scheduleId, request);
      } else {
        await scheduleApi.createSchedule(truckId, request);
      }

      onSuccess();
    } catch (e) {
      alert(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };

  const handleEndTime = () => {
    if(!startTime || !endTime) {
      return new Date(0, 0, 0, 0, 0);
    }

    const isSameDate = startTime.toDateString() === endTime.toDateString();

    return isSameDate ? startTime : new Date(0, 0, 0, 0, 0);
  }

  return (
    <Overlay>
      <Modal>
        <Title>
          {isEdit ? "스케줄 수정" : "스케줄 추가"}
        </Title>

        <Field>
          <Label>시작</Label>
          <DatePickerWrapper>
            <DatePicker
              selected={startTime}
              onChange={(date: Date | null) => setStartTime(date)}
              showTimeSelect
              timeIntervals={60}
              dateFormat="yyyy-MM-dd a hh:mm"
              timeFormat="a hh:mm"
              timeCaption="시간"
              placeholderText="시작 시간 선택"
              locale={ko}
              calendarStartDay={1}
              minDate={new Date()}
            />
          </DatePickerWrapper>
        </Field>

        <Field>
          <Label>종료</Label>
          <DatePickerWrapper>
            <DatePicker
              selected={endTime}
              onChange={(date: Date | null) => setEndTime(date)}
              showTimeSelect
              timeIntervals={60}
              dateFormat="yyyy-MM-dd a hh:mm"
              timeFormat="a hh:mm"
              placeholderText="종료 시간 선택"
              timeCaption="시간"
              locale={ko}
              calendarStartDay={1}
              minDate={startTime ?? new Date()}
              minTime={handleEndTime()}
              maxTime={new Date(0, 0, 0, 23, 59, 59)}
            />
          </DatePickerWrapper>
        </Field>

        <Field>
          <Label>장소</Label>
            <Autocomplete 
              options={locations}
              getOptionLabel={option => 
                option.name + (option.address ? `(${option.address})` : "")
              }
              value={selectedLocation}
              inputValue={inputValue}
              onInputChange={(e, newInputValue) => setInputValue(newInputValue)}
              onChange={(e, newValue) => {
                setSelectedLocation(newValue);
                setLocationId(newValue ? newValue.id : null);
              }}
              renderOption={(props, option) => (
                <li {...props} style={{padding: "8px 10px"}}>
                  <div style={{display: "flex", flexDirection: "column"}}>
                    <span style={{fontSize: 14, fontWeight: 600}}>
                      {option.name}
                    </span>
                    {option.address && (
                      <span style={{fontSize: 11, color: "#999"}}>
                        {option.address}
                      </span>
                    )}
                  </div>
                </li>
              )}
              renderInput={params => (
                <StyledTextField 
                  {...params}
                  placeholder="장소 검색"
                  size="small"               
                />
              )}
            />

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
  width: 380px;
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

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container input {
    width: 100%;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
    font-size: 13px;
  }

  .react-datepicker__input-container input:focus {
    outline: none;
    border-color: #ff6b00;
  }
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