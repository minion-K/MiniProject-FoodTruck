import PaymentSummary from "@/components/payment/PaymentSummary";
import UserTossPaySection from "@/components/payment/UserTossPaySection";
import PaymentProvider from "@/context/payment/PaymentProvider";
import styled from "@emotion/styled";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function UserTossPaymentPage() {
  const location = useLocation();
  const state = location.state;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  return (
    <PaymentProvider value={state}>
      <Container>
        <PaymentSummary />
        <UserTossPaySection />
      </Container>
    </PaymentProvider>
  );
}

export default UserTossPaymentPage;

const Container = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 24px;
`;
