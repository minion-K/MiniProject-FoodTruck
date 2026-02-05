import { reservationApi } from "@/apis/reservation/reservation.api";
import type { ReservationDetailResponse } from "@/types/reservation/reservation.dto";
import { formatPickupRange, ONE_HOUR } from "@/utils/date";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import KakaoMap from "../map/KakaoMap";
import ReservationModal from "./ReservationModal";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getPaymentStatus } from "@/utils/paymentStatus";
import { getReservationStatus } from "@/utils/reservationStatus";

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

      toast.success(
        reservation.paymentStatus === "SUCCESS"
          ? "예약이 취소되었습니다. 결제 금액은 자동으로 환불 처리됩니다."
          : "예약이 취소되었습니다.",
      );

      navigate("/mypage", {
        replace: true,
        state: { activeTab: "reservations" },
      });
    } catch (err) {
      const msg = getErrorMsg(err, "예약 취소에 실패했습니다.");

      alert(msg);
    }
  };

  const handlePayment = () => {
    if (!reservation) return;

    if (now >= start && !isDone) {
      toast("결제 가능한 시간이 지났습니다. 현장에서 결제해주세요.");

      return;
    }

    navigate("/pay/toss", {
      state: {
        targetId: reservation.id,
        targetType: "RESERVATION",
        productCode: `RES-${reservation.id}`,
        productName: reservation.truckName,
        amount: reservation.totalAmount,

        displayInfo: {
          pickupTime: reservation.pickupTime,
          menus: reservation.menuItems.map((menu) => ({
            name: menu.name,
            quantity: menu.quantity,
          })),
        },
      },
    });
  };

  if (loading) return <Container>Loading...</Container>;
  if (!reservation)
    return <Container>예약 정보를 불러올 수 없습니다.</Container>;

  const payment = getPaymentStatus(reservation.paymentStatus);
  const status = getReservationStatus(reservation.status);

  const now = new Date();
  const start = new Date(reservation.pickupTime);
  const end = new Date(start.getTime() + ONE_HOUR);

  const isPending = reservation.status === "PENDING";
  const isConfirmed = reservation.status === "CONFIRMED";
  const isCancelled = reservation.status === "CANCELED";
  const isDone =
    reservation.paymentStatus === "SUCCESS" ||
    reservation.paymentStatus === "REFUNDED";

  const cancelDisabled = !isPending || now >= start;
  const payDisabled = isDone || isCancelled || now >= end;
  const editDisabled = !isPending || now >= start || isDone;

  const cancelTitle = cancelDisabled
    ? isCancelled
      ? "예약이 취소되었습니다."
      : isConfirmed
        ? "예약이 확정되어 취소할 수 없습니다."
        : now >= start
          ? "이미 지난 예약입니다."
          : ""
    : "";

  const editTitle = editDisabled
    ? isDone
      ? "결제 완료된 예약은 변경할 수 없습니다."
      : "이미 지난 예약입니다."
    : "";

  const payTitle = payDisabled
    ? isDone
      ? "이미 결제가 완료되거나 환불된 예약입니다."
      : isCancelled
        ? "취소된 예약입니다."
        : "픽업 시간이 지난 예약은 결제할 수 없습니다."
    : "";

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
          <Label>이름: {reservation.username}</Label>
        </InfoRow>
        <InfoRow>
          <PickupWrapper>
            <Label>
              픽업 시간: {formatPickupRange(reservation.pickupTime)}
            </Label>
            <Notice>※ 해당 시간 내 방문</Notice>
          </PickupWrapper>
        </InfoRow>
        <InfoRow>
          <Label>금액: {reservation.totalAmount.toLocaleString()} KRW</Label>
        </InfoRow>
        <InfoRow>
          <Label>
            예약 상태:{" "}
            <Status style={{ backgroundColor: status.color }}>
              {status.label}
            </Status>
          </Label>
        </InfoRow>
        {!isCancelled && (
          <InfoRow>
            <Label>
              결제 상태:{" "}
              <PaymentStatus style={{ backgroundColor: payment.color }}>
                {payment.label}
              </PaymentStatus>
            </Label>
          </InfoRow>
        )}
        {isCancelled && (
          <InfoRow>
            <Notice>
              ※ 취소된 예약입니다. 결제된 금액은 자동으로 환불 처리되었습니다.
            </Notice>
          </InfoRow>
        )}
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
        <ActionButton
          cancel
          disabled={cancelDisabled}
          title={cancelTitle}
          onClick={handleCancelReservation}
        >
          예약 취소
        </ActionButton>
        <ActionButton
          pay
          onClick={handlePayment}
          disabled={payDisabled}
          title={payTitle}
        >
          {isDone ? "결제완료" : "결제하기"}
        </ActionButton>
        <ActionButton
          edit
          onClick={() => setIsEdit(true)}
          disabled={editDisabled}
          title={editTitle}
        >
          예약 변경
        </ActionButton>
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

const Status = styled.span`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 8px;
`;

const PaymentStatus = styled.span`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 8px;
  width: fit-content;
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

const ActionButton = styled.button<{
  cancel?: boolean;
  pay?: boolean;
  edit?: boolean;
}>`
  flex: 1;
  padding: 12px 0;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  background-color: ${({ cancel, pay, edit }) =>
    cancel ? "#f8d7da" : pay ? "#0d6efd" : edit ? "#ffc107" : "#e2e3e5"};
  color: ${({ cancel, pay, edit }) =>
    cancel ? "#842029" : pay ? "#fff" : edit ? "#212529" : "#6c757d"};

  &:hover {
    background-color: ${({ cancel, pay, edit }) =>
      cancel ? "#f5c2c7" : pay ? "#0b5ed7" : edit ? "#ffca2c" : "#d6d8db"};
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

const PickupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Notice = styled.span`
  font-size: 12px;
  color: #888;
`;
