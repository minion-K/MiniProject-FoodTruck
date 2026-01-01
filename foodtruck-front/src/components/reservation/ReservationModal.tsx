import { reservationApi } from '@/apis/reservation/reservation.api';
import type { ReservationDetailResponse } from '@/types/reservation/reservation.dto';
import type { TruckScheduleItemResponse } from '@/types/schedule/schedule.dto'
import type { TruckMenuItemResponse } from '@/types/truck/truck.dto';
import { getErrorMsg } from '@/utils/error';
import styled from '@emotion/styled'
import type { Axios, AxiosError } from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast';

interface ReservationModalProps {
  schedule: TruckScheduleItemResponse;
  menus: TruckMenuItemResponse[];
  onClose: () => void;
}

const ONE_HOUR = 1000 * 60 * 60;

function formatTime(date: Date) {
  const hour = String(date.getHours()).padStart(2, "0");
  
  return `${hour}:00`;
}

function toKstString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:00:00`;
}

interface TimeSlot {
  start: Date;
  end: Date;
  disabled: boolean;
}

function ReservationModal({schedule, menus, onClose}: ReservationModalProps) {
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [menuQty, setMenuQty] = useState<Record<number, number>>({});
  const [note, setNote] = useState("");

  const timeSlots: TimeSlot[] = useMemo(() => {
    const slots: TimeSlot[] =[];

    const start = new Date(schedule.startTime);
    const end = new Date(schedule.endTime);
    const now = new Date();

    let current = new Date(start);

    while(current.getTime() + ONE_HOUR <= end.getTime()) {
      const slotStart = new Date(current);
      const slotEnd = new Date(current.getTime() + ONE_HOUR);

      slots.push({
        start: slotStart,
        end: slotEnd,
        disabled: slotEnd <= now
      });

      current = slotEnd;
    }

    return slots;
  }, [schedule]);

  const totalAmount = menus.reduce((sum, menu) => {
    const qty = menuQty[menu.id] ?? 0;
    const total = sum + qty * menu.price;
    
    return total;
  }, 0);

  const canSubmit = selectedTime !== null && totalAmount > 0;

  const handleSubmit = async() => {
    if(!selectedTime) return ;

    const pickupTime =toKstString(selectedTime);

    const menuItems = menus
      .filter(menu => (menuQty[menu.id] ?? 0) > 0)
      .map(menu => ({
        menuItemId: menu.id,
        quantity: menuQty[menu.id]
      }));

      if(menuItems.length === 0) return ;

      try {
        await reservationApi.createReservation({
          scheduleId: schedule.scheduleId,
          pickupTime,
          menuItems,
          note: "",
        });

        toast.success("예약이 완료되었습니다.")
        onClose();
      } catch (err) {
        const msg = getErrorMsg(err, "예약에 실패했습니다. 다시 시도해주세요");

        alert(msg)
      }
  };

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>예약하기</Title>
          <CloseButton onClick={onClose}>X</CloseButton>
        </Header>

        <Section>
          <Label>픽업 장소</Label>
          <Value>{schedule.locationName}</Value>
        </Section>

        <Section>
          <Label>픽업 시간</Label>
          <TimeSlotGrid>
            {timeSlots.map(slot => (
              <TimeSlotButton
                key={slot.start.toISOString()}
                disabled={slot.disabled}
                data-selected={selectedTime?.getTime() === slot.start.getTime()}
                onClick={() => setSelectedTime(slot.start)}
              >
                {formatTime(slot.start)} ~ {formatTime(slot.end)}
              </TimeSlotButton>
            ))}
          </TimeSlotGrid>
        </Section>

        <Section>
          <Label>메뉴</Label>
          <MenuList>
            {menus.map(menu => {
              const qty = menuQty[menu.id] ?? 0;

              return (
                <MenuItem
                  key={menu.id}
                  data-soldout={menu.soldOut}
                >
                  <div>
                    <MenuName>{menu.name}</MenuName>
                    {menu.description && (
                      <MenuOption>{menu.description}</MenuOption>
                    )}
                  </div>

                  <MenuRight>
                    <QtyControl>
                      <QtyButton
                        disabled={qty === 0 || menu.soldOut}
                        onClick={() => setMenuQty(prev => ({
                          ...prev, [menu.id]: qty - 1
                        }))}
                      >
                        -
                      </QtyButton>

                      <Qty>{qty}</Qty>

                      <QtyButton
                        disabled={menu.soldOut}
                        onClick={() => setMenuQty(prev => ({
                          ...prev, [menu.id]: qty + 1
                        }))}
                      >
                        +
                      </QtyButton>
                    </QtyControl>

                    <MenuPrice>
                      {menu.price.toLocaleString()} KRW
                    </MenuPrice>
                  </MenuRight>
                </MenuItem>
              );
            })}
          </MenuList>
        </Section>

        <Section>
          <Label>요청사항 (선택)</Label>
          <NoteInput 
            placeholder="요청사항을 입력해주세요"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </Section>

        <Footer>
          <SubmitButton 
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {totalAmount.toLocaleString()} KRW · 예약하기
          </SubmitButton>
        </Footer>
      </Modal>
    </Overlay>
  )
}

export default ReservationModal

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 420px;
  background-color: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 18px;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.span`
  font-size: 14px;
  color: #111;
`;

const Value = styled.div`
  font-size: 14px;
  color: #111;
`;

const TimeSlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const TimeSlotButton = styled.button`
  padding: 10px 6px;
  font-size: 13px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #fff;

  &[data-selected="true"] {
    background-color: #ff6b00;
    color: white;
    border-color: #ff6b00;
  }
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-radius: 10px;
  background-color: #fafafa;
  border: 1px solid #eee;

  &[data-soldout="true"] {
    opacity: 0.5;
  }
`;

const MenuName = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const MenuOption = styled.div`
  font-size: 12px;
  color: #777;
`;

const MenuRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

const QtyControl = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const QtyButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid #ddd;
`;

const Qty = styled.span`
  min-width: 20px;
  text-align: center;
`;

const MenuPrice = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const NoteInput = styled.textarea`
  width: 100%;
  min-height: 60px;
  padding: 10px;
  font-size: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  resize: none;
`;

const Footer = styled.div`
  margin-top: 8px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;
  border: none;
  background-color: #ff6b00;
  color: white;
  cursor: not-allowed;
  opacity: 0.6;

  &:not(:disabled) {
    cursor: pointer;
    opacity: 1;
  }
`;