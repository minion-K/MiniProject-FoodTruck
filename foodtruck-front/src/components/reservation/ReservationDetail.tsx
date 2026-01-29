import { reservationApi } from "@/apis/reservation/reservation.api";
import type { ReservationDetailResponse } from "@/types/reservation/reservation.dto";
import { formatTime } from "@/utils/date";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import KakaoMap from "../map/KakaoMap";
import ReservationModal from "./ReservationModal";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Props {
  reservationId: string;
}

function ReservationDetail({ reservationId }: Props) {
  const [reservation, setReservation] =
    useState<ReservationDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!reservationId) return;

    const fetchReservation = async () => {
      try {
        const data = await reservationApi.getReservationById(
          Number(reservationId),
        );

        setReservation(data);
      } catch (err) {
        alert(getErrorMsg(err));
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId]);

  const handleUpdateReservation = (update: ReservationDetailResponse) => {
    setReservation(update);
    setIsEdit(false);
  };

  const handleCancelReservation = async () => {
    if (!reservation) return;

    const confirmCancel = window.confirm("예약을 취소하시겠습니까?");
    if (!confirmCancel) return;

    try {
      await reservationApi.cancelReservation(Number(reservationId));

      setReservation((prev) => (prev ? { ...prev, status: "CANCELED" } : prev));

      toast.success("예약이 취소되었습니다.");
    } catch (err) {
      const msg = getErrorMsg(err, "예약 취소에 실패했습니다.");

      alert(msg);
    }
  };

  const handlePayment = () => {
    if (!reservation) return;

    navigate("/pay/toss", {
      state: {
        targetId: reservation.id,
        targetType: "RESERVATION",
        productCode: `RES-${reservation.id}`,
        productName: reservation.truckName,
        amount: reservation.totalAmount,
      },
    });
  };

  if (loading) return <Container>Loading...</Container>;
  if (!reservation)
    return <Container>예약 정보를 불러올 수 없습니다.</Container>;

  const isPending = reservation.status === "PENDING";

  return (
    <Container>
      <Header>
        <Title>예약 상세</Title>
      </Header>

      <Section>
        <SectionTitle>트럭</SectionTitle>
        <InfoRow>
          <Label>이름: {reservation.truckName}</Label>
        </InfoRow>
        <InfoRow>
          <Label>위치: {reservation.locationName}</Label>
        </InfoRow>
        <MapWrapper>
          <KakaoMap
            center={{ lat: reservation.latitude, lng: reservation.longitude }}
            markers={[
              { lat: reservation.latitude, lng: reservation.longitude },
            ]}
          />
        </MapWrapper>
      </Section>

      <Section>
        <SectionTitle>예약 정보</SectionTitle>
        <InfoRow>
          <Label>예약자 ID: {reservation.username}</Label>
        </InfoRow>
        <InfoRow>
          <Label>
            픽업 시간: {formatTime(new Date(reservation.pickupTime))}
          </Label>
        </InfoRow>
        <InfoRow>
          <Label>총 금액: {reservation.totalAmount.toLocaleString()} KRW</Label>
        </InfoRow>
        <InfoRow>
          <Label>상태: {reservation.status}</Label>
        </InfoRow>
        <InfoRow>
          <Label>요청 사항: {reservation.note || "요청사항 없음"}</Label>
        </InfoRow>
      </Section>

      <Section>
        <SectionTitle>주문 메뉴</SectionTitle>

        {reservation.menuItems?.length > 0 &&
          reservation.menuItems.map((menu) => (
            <MenuRow key={menu.menuItemId}>
              <span>{menu.name}</span>
              <span>
                {menu.quantity}개 X {menu.price.toLocaleString()} KRW
              </span>
            </MenuRow>
          ))}

        <TotalRow>
          총 금액: {reservation.totalAmount.toLocaleString()} KRW
        </TotalRow>
      </Section>

      <Section>
        <SectionTitle>예약</SectionTitle>
        <InfoRow>
          <Label>예약한 시간: {reservation.createdAt}</Label>
        </InfoRow>
        <InfoRow>
          <Label>변경한 시간: {reservation.updatedAt}</Label>
        </InfoRow>
      </Section>

      <ButtonWrapper>
        {isPending && reservation.schedule && (
          <>
            <ActionButton
              cancel
              disabled={new Date(reservation.schedule.endTime) <= new Date()}
              title={
                new Date(reservation.schedule.endTime) <= new Date()
                  ? "이미 지난 예약입니다."
                  : ""
              }
              onClick={handleCancelReservation}
            >
              예약 취소
            </ActionButton>
            <ActionButton
              onClick={handlePayment}
              disabled={new Date(reservation.schedule.endTime) <= new Date()}
              title={
                new Date(reservation.schedule.endTime) <= new Date()
                  ? "이미 지난 예약입니다."
                  : ""
              }
            >
              결제하기
            </ActionButton>
            <ActionButton
              onClick={() => setIsEdit(true)}
              disabled={new Date(reservation.schedule.endTime) <= new Date()}
              title={
                new Date(reservation.schedule.endTime) <= new Date()
                  ? "이미 지난 예약입니다."
                  : ""
              }
            >
              예약 변경
            </ActionButton>
          </>
        )}
      </ButtonWrapper>

      {isEdit && reservation.schedule && (
        <ReservationModal
          mode="EDIT"
          reservationId={reservation.id}
          schedule={reservation.schedule}
          initialPickupTime={reservation.pickupTime}
          initialMenuItems={reservation.menuItems.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
          }))}
          initialNote={reservation.note}
          menus={reservation.menuItems.map((item) => ({
            id: item.menuItemId,
            name: item.name,
            price: item.price,
            isSoldOut: false,
          }))}
          onClose={() => setIsEdit(false)}
          onUpdate={handleUpdateReservation}
        />
      )}
    </Container>
  );
}

export default ReservationDetail;

const Container = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div``;

const Title = styled.h1`
  margin: 0;
  font-size: 22px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
  border-radius: 10px;
  background-color: #fff;
  border: 1px solid #eee;
`;

const SectionTitle = styled.h2`
  margin-bottom: 8px;
  font-size: 16px;
`;

const InfoRow = styled.div`
  font-size: 14px;
  color: #333;
`;

const Label = styled.span`
  font-weight: 600;
  margin-right: 6px;
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 220px;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 8px;
`;

const MenuRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  border-bottom: 1px solid #f0f0f0;
`;

const TotalRow = styled.div`
  margin-top: 12px;
  text-align: right;
  font-size: 15px;
  font-weight: 700;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`;

const ActionButton = styled.button<{ cancel?: boolean }>`
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;

  background-color: ${({ cancel }) => (cancel ? "#f8d7da" : "#d1e7dd")};
  color: ${({ cancel }) => (cancel ? "#842029" : "#0f5132")};

  &:hover {
    background-color: ${({ cancel }) => (cancel ? "#f5c2c7" : "#badbcc")};
  }

  &:disabled {
    background-color: #e0e0e0;
    color: #888888;
    cursor: not-allowed;

    &:hover {
      background-color: #e0e0e0;
    }
  }
`;
