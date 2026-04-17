import { paymentApi } from "@/apis/payment/payment.api";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import React, { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

function TossSuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const approveRef = useRef(false);

  useEffect(() => {
    if (approveRef.current) return;

    const paymentKey = params.get("paymentKey");
    const tossOrderId = params.get("orderId");
    const orderId = params.get("targetId");
    const targetId = Number (orderId);
    const amount = params.get("amount");
    const productCode = params.get("productCode");
    const productName = params.get("productName");

    if (!paymentKey || !orderId || !targetId || !amount || !productCode || !productName) {
      alert("필수 파라미터가 누락되었습니다.");

      navigate("/pay/toss");
      return;
    }

    approveRef.current = true;

    (async () => {
      try {
        await paymentApi.approvePayment({
          paymentKey,
          tossOrderId,
          orderId: null,
          amount: Number(amount),
          method: "TOSS_PAY",
          productCode,
          productName,
        });

        toast.success("결제가 완료되었습니다.");
        navigate("/mypage", {
          replace: true,
          state: { activeTab: "reservations" },
        });
      } catch (e) {
        alert(getErrorMsg(e));
        navigate("/mypage", {
          replace: true,
          state: { activeTab: "reservations" },
        });
      }
    })();
  }, [params, navigate]);

  return (
    <Container>
      <h3>Toss 결제 처리 중입니다...</h3>
      <p>잠시만 기다려주세요.</p>
    </Container>
  );
}

export default TossSuccessPage;

const Container = styled.div`
  padding: 24px;
  text-align: center;
`;
