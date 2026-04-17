import { reservationApi } from "@/apis/reservation/reservation.api";
import type { TruckScheduleItemResponse } from "@/types/schedule/schedule.dto";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { formatTime, ONE_HOUR, toKstString } from "@/utils/date";
import type {
  ReservationDetailResponse,
  ReservationMenuItemRequest,
  ReservationUpdateRequest,
} from "@/types/reservation/reservation.dto";
import ReservationCompleteModal from "./ReservationCompleteModal";
import type { MenuListItemResponse } from "@/types/menu/menu.dto";

interface ReservationModalProps {
  schedule?: TruckScheduleItemResponse;
  menus?: MenuListItemResponse[];

  mode?: "CREATE" | "EDIT";
  reservationId?: number;
  initialPickupTime?: string;
  initialMenuItems?: ReservationMenuItemRequest[];
  initialNote?: string;

  onClose: () => void;
  onUpdate?: (update: ReservationDetailResponse) => void;
}

interface TimeSlot {
  start: Date;
  end: Date;
  disabled: boolean;
}

function ReservationModal({
  schedule,
  menus,
  onClose,
  mode = "CREATE",
  reservationId,
  initialPickupTime,
  initialMenuItems,
  initialNote,
  onUpdate,
}: ReservationModalProps) {
  const [selectedTime, setSelectedTime] = useState<Date | null>(
    initialPickupTime ? new Date(initialPickupTime) : null,
  );
  const [menuQty, setMenuQty] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    initialMenuItems?.forEach((item) => {
      initial[item.menuItemId] = item.quantity;
    });

    return initial;
  });

  const [step, setStep] = useState<"FORM" | "COMPLETE">("FORM");
  const [summary, setSummary] = useState<{
    reservationId: number;
    truckName: string;
    pickupTime: string;
    menus: {
      name: string;
      quantity: number;
      price: number;
    }[];
    totalAmount: number;
  } | null>(null);

  const [note, setNote] = useState(initialNote);
  const [loading, setLoading] = useState(false);
  const PAGE_SIZE = 6;
  const [page, setPage] = useState(0);

  const timeSlots: TimeSlot[] = useMemo(() => {
    if (!schedule) return [];

    const slots: TimeSlot[] = [];
    const start = new Date(schedule.startTime);
    const end = new Date(schedule.endTime);
    const now = new Date();

    let current = new Date(start);

    while (current.getTime() + ONE_HOUR <= end.getTime()) {
      const slotStart = new Date(current);
      const slotEnd = new Date(current.getTime() + ONE_HOUR);

      slots.push({
        start: slotStart,
        end: slotEnd,
        disabled: slotEnd <= now,
      });

      current = slotEnd;
    }

    return slots;
  }, [schedule]);

  const enablePaging = useMemo(() => {
    if(!schedule) return false;

    return timeSlots.length > PAGE_SIZE;
  }, [timeSlots]);

  const pageSlots = useMemo(() => {
    if(!enablePaging) return timeSlots;

    const start = page * PAGE_SIZE;

    return timeSlots.slice(start, start + PAGE_SIZE);
  }, [timeSlots, page, enablePaging]);

  const handlePrev = () => {
    setPage(prev => Math.max(prev - 1, 0));
  }

  const handleNext = () => {
    setPage(prev => {
      const maxPage = Math.floor((timeSlots.length - 1) / PAGE_SIZE);

      return Math.min(prev + 1, maxPage)
    });
  };

  useEffect(() => {
    if(initialPickupTime) {
      setSelectedTime(new Date(initialPickupTime));
    }
  }, [initialPickupTime]);

  useEffect(() => {
    if(!selectedTime) return; 
    if(!enablePaging) return;

    const idx = timeSlots.findIndex(slot => 
      slot.start.getTime() === selectedTime.getTime()
    );

    if(idx !== -1) {
      setPage(Math.floor(idx / PAGE_SIZE));
    }
  }, [selectedTime, timeSlots, enablePaging]);

  useEffect(() => {
    if(mode != "CREATE") return;
    if(!timeSlots.length) return;

    const firstEnabled = timeSlots.findIndex(s => !s.disabled);

    if(firstEnabled !== -1) {
      setPage(Math.floor(firstEnabled / PAGE_SIZE));
    }
  }, [timeSlots, mode]);

  const totalAmount =
    menus?.reduce((sum, menu) => {
      const qty = menuQty[menu.id] ?? 0;
      const total = sum + qty * menu.price;

      return total;
    }, 0) ?? 0;

  const canSubmit = selectedTime !== null && totalAmount > 0;

  const handleSubmit = async () => {
    if (!selectedTime) return;
    if (!menus) return;

    const pickupTime = toKstString(selectedTime);

    const menuItems: ReservationMenuItemRequest[] = menus
      .filter((menu) => (menuQty[menu.id] ?? 0) > 0)
      .map((menu) => ({
        menuItemId: menu.id,
        quantity: menuQty[menu.id],
      }));

    if (menuItems.length === 0) return;

    setLoading(true);

    try {
      let reservation: ReservationDetailResponse;

      if (mode === "CREATE" && schedule) {
        reservation = await reservationApi.createReservation({
          scheduleId: schedule.scheduleId,
          pickupTime,
          menuItems,
          note,
        });

        const summaryMenus = menus
          .filter((menu) => (menuQty[menu.id] ?? 0) > 0)
          .map((menu) => ({
            name: menu.name,
            quantity: menuQty[menu.id],
            price: menu.price,
          }));

        setSummary({
          reservationId: reservation.id,
          truckName: reservation.truckName,
          pickupTime,
          menus: summaryMenus,
          totalAmount,
        });

        toast.success("예약이 완료되었습니다.");
        setStep("COMPLETE");
      } else if (mode === "EDIT" && reservationId) {
        const updateRequest: ReservationUpdateRequest = {
          pickupTime,
          menuItems,
          note,
        };

        reservation = await reservationApi.updateReservation(
          reservationId,
          updateRequest,
        );

        toast.success("예약이 수정되었습니다.");
        onUpdate?.(reservation);

        onClose();
      }
    } catch (err) {
      const msg = getErrorMsg(
        err,
        mode === "CREATE"
          ? "예약에 실패했습니다. 다시 시도해주세요."
          : "예약 수정에 실패했습니다. 다시 시도해주세요.",
      );

      alert(msg);
      onClose();
    } finally {
      setLoading(false);
    }
  };


  if (step === "COMPLETE" && summary) {
    return <ReservationCompleteModal summary={summary} onClose={onClose} />;
  }

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{mode === "EDIT" ? "예약 수정" : "예약 하기"}</Title>
          <CloseButton onClick={onClose}>X</CloseButton>
        </Header>

        <Content>
          {schedule && (
            <Section>
              <LocationRow>
                <Label>픽업 장소</Label>
                <Value>{schedule.locationName}</Value>
              </LocationRow>
            </Section>
          )}
          <Section>
            <Label>픽업 시간</Label>
            {enablePaging && (
              <SliderHeader>
                <NavButton onClick={handlePrev} disabled={page === 0}>
                  ◀
                </NavButton>

                <RangeLabel>
                  {formatTime(pageSlots[0].start)} ~{" "}
                  {formatTime(pageSlots.at(-1)!.end)}
                </RangeLabel>

                <NavButton onClick={handleNext} disabled={(page + 1) * PAGE_SIZE >= timeSlots.length}>
                  ▶
                </NavButton>
              </SliderHeader>
            )}
            <TimeSlotGrid>
              {pageSlots.map((slot) => (
                <TimeSlotButton
                  key={toKstString(slot.start)}
                  disabled={slot.disabled}
                  data-selected={selectedTime?.getTime() === slot.start.getTime()}
                  onClick={() => setSelectedTime(slot.start)}
                >
                  {formatTime(slot.start)} ~ {formatTime(slot.end)}
                </TimeSlotButton>
              ))}
            </TimeSlotGrid>
          </Section>

          {menus && (
            <MenuSection>
              <Label>메뉴</Label>
              <MenuList>
                {menus.map((menu) => {
                  const qty = menuQty[menu.id] ?? 0;

                  return (
                    <MenuItem key={menu.id}>
                      <MenuLeft>
                        <NameRow>
                          <MenuName isSoldOut={menu.isSoldOut}>
                            {menu.name}
                          </MenuName>
                          {menu.isSoldOut && (
                            <SoldOut>품절</SoldOut>
                          )}
                        </NameRow>
                        {menu.optionText && (
                          <MenuOption>선택사항: {menu.optionText}</MenuOption>
                        )}
                      </MenuLeft>
                      <MenuRight>
                        <MenuPrice>{menu.price.toLocaleString()} KRW</MenuPrice>

                        <QtyControl>
                          <QtyButton
                            disabled={qty === 0 || menu.isSoldOut}
                            onClick={() =>
                              setMenuQty((prev) => ({
                                ...prev,
                                [menu.id]: qty - 1,
                              }))
                            }
                            isSoldOut={menu.isSoldOut}
                          >
                            -
                          </QtyButton>

                          <Qty>{qty}</Qty>

                          <QtyButton
                            disabled={menu.isSoldOut}
                            onClick={() =>
                              setMenuQty((prev) => ({
                                ...prev,
                                [menu.id]: qty + 1,
                              }))
                            }
                            isSoldOut={menu.isSoldOut}
                          >
                            +
                          </QtyButton>
                        </QtyControl>
                      </MenuRight>
                    </MenuItem>
                  );
                })}
              </MenuList>
            </MenuSection>
          )}

          <Section>
            <Label>요청사항 (선택)</Label>
            <NoteInput
              placeholder="요청사항을 입력해주세요"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Section>

          <Footer>
            <SubmitButton disabled={!canSubmit} onClick={handleSubmit}>
              {mode === "EDIT"
                ? "예약 수정"
                : `${totalAmount.toLocaleString()} KRW · 예약하기`}
            </SubmitButton>
          </Footer>
        </Content>
      </Modal>
    </Overlay>
  );
}

export default ReservationModal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 520px;
  height: 90vh;
  background-color: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  overflow: hidden;
  padding-right: 10px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 4px 0;
`;

const Title = styled.h2`
  font-size: 18px;
  margin: 0 auto;
  flex: 1;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  padding: 4px 8px;
  right: 0;
  border-radius: 8px;
  border: none;
  background: transparent;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
    border-radius: 4px;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MenuSection = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LocationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
`;

const Label = styled.span`
  font-size: 14px;
  color: #111;
`;

const Value = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #111;
`;

const SliderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0 10px;
`;

const NavButton = styled.button`
  border: none;
  background: #f3f4f6;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const RangeLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #333;
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
  padding: 10px 12px;
  border-radius: 10px;
  background-color: #fafafa;
  border: 1px solid #eee;
  align-items: center;
`;

const MenuLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

const MenuRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 6px;
  min-width: 90px;
`;

const MenuPrice = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #111;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SoldOut = styled.div`
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #ffe5e5;
  color: #ff4d4f;
  white-space: nowrap;
`;

const MenuName = styled.div<{isSoldOut: boolean}>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ isSoldOut }) => (isSoldOut ? "#999" : "#000")}; 
`;

const MenuOption = styled.div`
  font-size: 12px;
  color: #777;
`;

const QtyControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QtyButton = styled.button<{isSoldOut: boolean}>`
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 12px;

  cursor: ${({isSoldOut}) => isSoldOut ? "not-allowed" : "pointer"};
`;

const Qty = styled.span`
  min-width: 20px;
  text-align: center;
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
  margin-top: auto;
  padding-top: 8px;
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
