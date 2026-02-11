import { scheduleApi } from '@/apis/schedule/schdule.api';
import type { TruckScheduleItemResponse, TruckScheduleListResponse } from '@/types/schedule/schedule.dto';
import { getErrorMsg } from '@/utils/error';
import styled from '@emotion/styled';
import React, { useState } from 'react'
import ScheduleModal from './ScheduleModal';
import { formatDateTime, formatTime } from '@/utils/date';
import toast from 'react-hot-toast';

interface Props {
  truckId: number;
  schedules: TruckScheduleListResponse;
  onUpdate: () => void;
}

function ScheduleManager({truckId, schedules, onUpdate}: Props) {
  const [selected, setSelected] = useState<TruckScheduleItemResponse | null>(null);
  const [open, setOpen] = useState(false);

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
        {schedules.map(schedule => (
          <Item key={schedule.scheduleId}>
            <Info>
              <div>{schedule.locationName ?? "장소 미지정"}</div>
              <Time>
                {formatDateTime(schedule.startTime)} ~ {formatDateTime(schedule.endTime)}
              </Time>
            </Info>

            <Actions>
              <ActionButton onClick={() => {handleEdit(schedule)}}>
                수정
              </ActionButton>
              <ActionButton onClick={() => {
                handleDelete(schedule.scheduleId)
              }}>
                삭제
              </ActionButton>
            </Actions>
          </Item>
        ))}
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
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
  padding: 10px 12px;
  border-radius: 10px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
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