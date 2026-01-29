import OwnerOnsitePaySection from "@/components/payment/OwnerOnsitePaySection";
import PaymentSummary from "@/components/payment/PaymentSummary";
import PaymentProvider from "@/context/payment/PaymentProvider";
import styled from "@emotion/styled";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function OwnerOnsitePaymentPage() {
  const location = useLocation();
  const state = location.state;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  return (
    <PaymentProvider value={state}>
      <Container>
        <PaymentSummary />
        <OwnerOnsitePaySection />
      </Container>
    </PaymentProvider>
  );
}

export default OwnerOnsitePaymentPage;

const Container = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 24px;
`;
