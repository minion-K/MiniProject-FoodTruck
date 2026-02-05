import { usePaymentContext } from "@/context/payment/PaymentContext";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import React, { useEffect, useRef } from "react";

const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY as string;

function UserTossPaySection() {
  const { productCode, productName, amount } = usePaymentContext();

  const handleTossPay = async () => {
    if (!(window as any).TossPayments) {
      alert("TossPayments SDK 로드 실패");

      return;
    }

    const tossPayments = (window as any).TossPayments(TOSS_CLIENT_KEY);
    const orderId = crypto.randomUUID();
    const origin = window.location.origin;

    const successUrl = new URL("/pay/toss/success", origin);
    successUrl.searchParams.set("orderId", orderId);
    successUrl.searchParams.set("amount", String(amount));
    successUrl.searchParams.set("productCode", productCode);
    successUrl.searchParams.set("productName", productName);

    const failUrl = `${origin}/pay/toss/fail`;

    try {
      await tossPayments.requestPayment("카드", {
        amount: amount,
        orderId: orderId,
        orderName: productName,
        successUrl: successUrl.toString(),
        failUrl,
      });
    } catch (error: any) {
      alert("Toss 결제 오류: " + (getErrorMsg(error) ?? ""));
    }
  };

  return (
    <Section>
      <SectionTitle>간편 결제 (TossPay)</SectionTitle>
      <Button onClick={handleTossPay}>결제 하기</Button>
    </Section>
  );
}

export default UserTossPaySection;

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
