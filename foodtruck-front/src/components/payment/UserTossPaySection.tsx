import { paymentApi } from "@/apis/payment/payment.api";
import { usePaymentContext } from "@/context/payment/PaymentContext";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY as string;

function UserTossPaySection() {
  const { productCode, productName, amount } = usePaymentContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get("success");
    const fail = params.get("fail");

    if (success) {
      toast.success("결제가 완료되었습니다.");
      navigate("/mypage", { replace: true });
    } else if (fail) {
      alert("결제에 실패했습니다.");
    }
  }, [location.search, navigate]);

  const handleTossPay = async () => {
    if (!(window as any).TossPayments) {
      alert("TossPayments SDK 로드 실패");

      return;
    }

    try {
      const payment = (await paymentApi.createPayment({
        productCode,
        productName,
        amount,
        method: "TOSS_PAY",
      })) as any;

      const tossPayments = (window as any).TossPayments(TOSS_CLIENT_KEY);

      const successUrl = `${window.location.origin}/mypage?success=true&orderId=${payment.orderId}`;
      const failUrl = `${window.location.origin}/mypage?fail=true&orderId=${payment.orderId}`;

      await tossPayments.requestPayment("카드", {
        amount: payment.amount,
        orderId: payment.orderId,
        orderName: payment.productName,
        successUrl,
        failUrl,
      });
    } catch (error: any) {
      alert(getErrorMsg(error) ?? "Toss 결제 실패");
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
