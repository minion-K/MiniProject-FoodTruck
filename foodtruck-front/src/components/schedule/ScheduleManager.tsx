import { scheduleApi } from '@/apis/schedule/schdule.api';
import type { TruckScheduleItemResponse, TruckScheduleListResponse } from '@/types/schedule/schedule.dto';
import { getErrorMsg } from '@/utils/error';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'
import ScheduleModal from './ScheduleModal';
import { formatDateTime } from '@/utils/date';
import toast from 'react-hot-toast';
import type { ScheduleStatus } from '@/types/schedule/schedule.type';
import { getScheduleStatus } from '@/utils/ScheduleStatus';
import { useNavigate } from 'react-router-dom';

interface Props {
  truckId: number;
  schedules: TruckScheduleListResponse;
  onUpdate: () => void;
}

function ScheduleManager({truckId, schedules, onUpdate}: Props) {
  const [selected, setSelected] = useState<TruckScheduleItemResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [statusPopup, setStatusPopup] = useState< number | null>(null);
  const navigate = useNavigate();

  const handleAdd = () => {
    setSelected(null);
    setOpen(true);
  }

  const handleEdit = (schedule: TruckScheduleItemResponse) => {
    setSelected(schedule)
    setOpen(true);
  }

  const handleDelete = async (scheduleId: number) => {
    if(!confirm("해당 스케줄을 삭제하시겠습니까?")) return;

    try {
      await scheduleApi.deleteSchedule(scheduleId);

      toast.success("스케줄이 삭제되었습니다.", {icon: "🗑️"});
      onUpdate();
    } catch (e) {
      alert(getErrorMsg(e));
    } 
  };

  const handleSuccess = () => {
    setOpen(false);
    setSelected(null);

    if(selected) {
      toast.success("스케줄이 수정되었습니다.");
    } else {
      toast.success("스케줄이 추가되었습니다.");
    }

    onUpdate();
  }

  const handleStatusClick = (scheduleId: number) => {
    setStatusPopup(prev => prev === scheduleId ? null : scheduleId);
  };

  const handleStatusChange = async (schedule: TruckScheduleItemResponse, newStatus: ScheduleStatus) => {
    setStatusPopup(null);
    
    try {
      await scheduleApi.updateScheduleStatus(schedule.scheduleId, {status : newStatus});
      
      toast.success("상태가 변경되었습니다.");
      onUpdate()
    } catch (e) {
      alert(getErrorMsg(e));
    }
  };

  const handleScheduleClick = (scheduleId: number) => {
    navigate("/owner/reservations", {
      state : {
        selectedTruckId: truckId,
        selectedScheduleId: scheduleId,
        activeTab: "reservation"
      }
    });
  }

  const availableStatuses: ScheduleStatus[] = ["PLANNED", "OPEN", "CLOSED", "CANCELED"];

  return (
    <Container>
      <Header>
        <AddButton onClick={handleAdd}>
          + 스케줄 추가
        </AddButton>
      </Header>

      {schedules.length === 0 ? (
        <EmptyText>등록된 스케줄이 없습니다.</EmptyText>
      ) : (
        <List>
        {schedules.map(schedule => {
          const status = getScheduleStatus(schedule.status);
          
          return (
            <Item 
              key={schedule.scheduleId}
              onClick={() => handleScheduleClick(schedule.scheduleId)}
            >
              <Info>
                <LocationStatus>
                  <Location>{schedule.locationName ?? "장소 미지정"}</Location>

                  <StatusWrapper
                    tabIndex={0}
                    onBlur={() => setStatusPopup(null)}
                  >
                    <Status 
                      style={{
                        color: status.color,
                        borderColor: status.color
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusClick(schedule.scheduleId);
                      }}
                    >
                      {status.label}
                    </Status>
                    
                    {statusPopup === schedule.scheduleId && (
                      <StatusPopup>
                        {availableStatuses.map(status => {
                          const s = getScheduleStatus(status);
                          
                          return (
                            (
                              <StatusOption
                                key={status}
                                disabled={status === schedule.status}
                                style={{
                                  color: s.color,
                                  borderColor: s.color
                                }}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleStatusChange(schedule, status)
                                }}
                              >
                                {s.label}
                              </StatusOption>
                            ))}
                          )}
                      </StatusPopup>
                    )}
                  </StatusWrapper>
                </LocationStatus>
                <Time>
                  {formatDateTime(schedule.startTime)} ~ {formatDateTime(schedule.endTime)}
                </Time>
              </Info>


              <Actions>
                <ActionButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(schedule);
                  }}
                >
                  수정
                </ActionButton>
                <ActionButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(schedule.scheduleId);
                  }}
                >
                  삭제
                </ActionButton>
              </Actions>
            </Item>
          )
        })}
      </List>
      )}

      {open && (
        <ScheduleModal 
          truckId={truckId}
          schedule={selected}
          onClose={() => {
            setOpen(false);
            setSelected(null);
          }}
          onSuccess={handleSuccess}
        />
      )}
    </Container>
  )
}

export default ScheduleManager

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  background: #fff;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const AddButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: #ff6b00;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #e65a00;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LocationStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatusWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Location = styled.div`
  font-weight: 500;
  font-size: 13px;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f3f4f6;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Status = styled.span`
  display: inline-block;
  padding: 2px 8px;
  font-size: 9px;
  font-weight: 500;
  border-radius: 6px;
  background: white;
  border: 1px solid;
  cursor: pointer;

  &:hover {
    background: #f7f7f7;
  }
`;

const StatusPopup = styled.div`
  position: absolute;
  padding: 2px 4px;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  border-radius: 6px;
  z-index: 10;
  min-width: 100px;
  display: flex;
  gap: 6px;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    border-top: 6px solid white;
  }
`;

const StatusOption = styled.button`
  padding: 2px 8px;
  font-size: 9px;
  font-weight: 500;
  border: 1px solid;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: #f5f5f5;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Time = styled.div`
  font-size: 13px;
  color: #666;
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
`;

const ActionButton = styled.button`
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background-color: #f2f2f2;

  &:hover {
    background-color: #ddd;
  }
`;

const EmptyText = styled.div`
  font-size: 14px;
  color: #888;
  padding: 12px;
  background: #fafafa;
  border-radius: 10px;
  text-align: center;
`;