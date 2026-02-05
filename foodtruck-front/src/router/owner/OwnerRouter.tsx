import Layout from "@/components/layouts/Layout";
import OwnerPage from "@/pages/owner/OwnerPage";
import TruckPaymentPage from "@/pages/owner/TruckPaymentPage";
import TruckReservationPage from "@/pages/owner/TruckReservationPage";
import TruckStatisticspage from "@/pages/owner/TruckStatisticspage";
import { useAuthStore } from "@/stores/auth.store";
import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

function OwnerRouter() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });

      return;
    }

    if (!user?.roles.includes("OWNER")) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user || !user.roles.includes("OWNER")) {
    return null;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout showSidebar={true}>
            <OwnerPage />
          </Layout>
        }
      />
      <Route
        path="/reservations"
        element={
          <Layout showSidebar={true}>
            <TruckReservationPage />
          </Layout>
        }
      />
      <Route
        path="/payments"
        element={
          <Layout showSidebar={true}>
            <TruckPaymentPage />
          </Layout>
        }
      />
      <Route
        path="/statistics"
        element={
          <Layout showSidebar={true}>
            <TruckStatisticspage />
          </Layout>
        }
      />
    </Routes>
  );
}

export default OwnerRouter;
