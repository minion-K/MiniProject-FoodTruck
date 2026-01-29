import { usePaymentContext } from "@/context/payment/PaymentContext";
import useCreatePayment from "@/hooks/useCreatePayment";
import styled from "@emotion/styled";
import React from "react";
import toast from "react-hot-toast";

function OwnerOnsitePaySection() {
  const { amount, productName, productCode } = usePaymentContext();
  const { mutate, isPending } = useCreatePayment();

  const handleMockPay = () => {
    mutate(
      {
        productCode,
        productName,
        amount,
        method: "MOCK",
      },
      {
        onSuccess: () => {
          toast.success("결제가 완료되었습니다.");
        },
      },
    );
  };

  return (
    <Section>
      <SectionTitle>현장 결제</SectionTitle>
      <Button onClick={handleMockPay} disabled={isPending}>
        {isPending ? "결제 처리 중..." : "현장 결제 완료"}
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
