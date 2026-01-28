import { formatTime } from "@/utils/date";
import styled from "@emotion/styled";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface ReservationSummary {
  reservationId: number;
  pickupTime: string;
  menus: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
}

interface Props {
  summary: ReservationSummary;
  onClose: () => void;
}

function ReservationCompleteModal({ summary, onClose }: Props) {
  const navigate = useNavigate();

  const handlePayment = () => {
    toast("결제 기능은 준비중입니다.", {
      icon: "💳",
    });
  };

  const handleMyPage = () => {
    navigate("/mypage");
    onClose();
  };

  return (
    <Overlay>
      <Container>
        <Icon>✅</Icon>

        <Title>예약이 접수되었습니다.</Title>
        <Description>픽업 시 현장 결제도 가능합니다.</Description>

        <ReservationWrapper>
          <Label>예약 번호</Label>
          <ReservationId>#{summary.reservationId}</ReservationId>
        </ReservationWrapper>

        <SummaryWrapper>
          <SummaryRow>
            <SummaryLabel>픽업 시간</SummaryLabel>
            <SummaryValue>
              {formatTime(new Date(summary.pickupTime))}
            </SummaryValue>
          </SummaryRow>

          <SummaryRow>
            <SummaryLabel>메뉴</SummaryLabel>
            <SummaryValue>
              {summary.menus.map((menu) => (
                <MenuLine key={menu.name}>
                  {menu.name} X {menu.quantity} 개
                </MenuLine>
              ))}
            </SummaryValue>
          </SummaryRow>

          <SummaryRow>
            <SummaryLabel>총 금액</SummaryLabel>
            <TotalAmount>
              {summary.totalAmount.toLocaleString()} KRW
            </TotalAmount>
          </SummaryRow>
        </SummaryWrapper>

        <ButtonWrapper>
          <PrimaryButton onClick={handlePayment}>결제하기</PrimaryButton>

          <SecondaryButton onClick={handleMyPage}>
            마이페이지로 이동
          </SecondaryButton>

          <TextButton onClick={onClose}>나중에 할게요</TextButton>
        </ButtonWrapper>
      </Container>
    </Overlay>
  );
}

export default ReservationCompleteModal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Container = styled.div`
  background-color: white;
  width: 100%;
  max-width: 360px;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
`;

const Icon = styled.div`
  font-size: 44px;
  margin-bottom: 12px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const Description = styled.p`
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const SummaryWrapper = styled.div`
  background-color: #fafafa;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  text-align: left;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const SummaryLabel = styled.div`
  font-size: 13px;
  color: #888;
  min-width: 70px;
`;

const SummaryValue = styled.div`
  font-size: 13px;
  font-weight: 500;
  text-align: right;
`;

const MenuLine = styled.div`
  line-height: 1.4;
`;

const TotalAmount = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #ff6b00;
`;

const ReservationWrapper = styled.div`
  background-color: #f4f4f4;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 24px;
`;

const Label = styled.div`
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
`;

const ReservationId = styled.div`
  font-size: 15px;
  font-weight: 600;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PrimaryButton = styled.button`
  padding: 12px;
  border-radius: 10px;
  border: none;
  background-color: #ff6b00;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const SecondaryButton = styled.button`
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background-color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: #f7f7f7;
    border-color: #ccc;
  }
`;

const TextButton = styled.button`
  margin-top: 4px;
  background: none;
  border: none;
  font-size: 13px;
  color: #888;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
