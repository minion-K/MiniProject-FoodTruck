import { orderApi } from "@/apis/order/order.api";
import type { OwnerOrderListItemResponse } from "@/types/order/order.dto";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Props {
  order: OwnerOrderListItemResponse;
  selectedTruckId: number;
  selectedScheduleId: number;
  activeTab: "reservation" | "order";
  paymentType?: "CARD" | "CASH";
}

function OwnerOnsitePaySection({order, selectedTruckId, selectedScheduleId, activeTab, paymentType}: Props) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleMockPay = async () => {
    try {
      setLoading(true);
      await orderApi.payOrder(order.id);

      toast.success(paymentType === "CARD" 
        ? "카드 결제를 완료했습니다."
        : "현금 결제를 완료했습니다."
      );

      navigate("/owner/reservations" , {
        state: {
          selectedTruckId,
          selectedScheduleId,
          activeTab
        }
      });
    } catch (e) {
      alert(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section>
      <SectionTitle>현장 결제</SectionTitle>
      <Button onClick={handleMockPay} disabled={loading || order.paymentStatus == "SUCCESS"}>
        {loading ? "결제 처리 중..." : "결제하기"}
      </Button>
    </Section>
  );
}

export default OwnerOnsitePaySection;

const Section = styled.div`
  margin-bottom: 16px;
`;

const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #222;
`;

const Button = styled.button`
  width: 100%;
  height: 50px;
  background: #0064ff;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;
