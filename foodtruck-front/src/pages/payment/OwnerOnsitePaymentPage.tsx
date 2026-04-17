import OwnerOnsitePaySection from "@/components/payment/OwnerOnsitePaySection";
import PaymentSummary from "@/components/payment/PaymentSummary";
import PaymentProvider from "@/context/payment/PaymentProvider";
import styled from "@emotion/styled";
import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

function OwnerOnsitePaymentPage() {
  const [onsiteType, setOnsiteType] = useState(null);
  const location = useLocation();
  const state = location.state;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  return (
    <PaymentProvider value={{
      targetId: state.order.id,
      targetType: "ONSITE",
      amount: state.order.amount,
      productCode: `ORD-${state.order.id}`,
      productName: state.productName,
      
      onsiteType: state.onsiteType,
      selectedTruckId: state.selectedTruckId,
      selectedScheduleId: state.selectedScheduleId,
      
      displayInfo: {
        menus: state.order.menus?.map((m: any) => ({
          name: m.menuItemName,
          quantity: m.qty
        })) ?? [],
        pickupTime: state.order.pickupTime
      }
    }}>
      <Container>
        <PaymentSummary/>
        <OwnerOnsitePaySection
          order={state.order}
          selectedTruckId={state.selectedTruckId}
          selectedScheduleId={state.selectedScheduleId}
          activeTab={state.activeTab}
        />
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
