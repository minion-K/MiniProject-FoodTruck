import Layout from "@/components/layouts/Layout";
import OwnerPage from "@/pages/owner/OwnerPage";
import OwnerPaymentPage from "@/pages/owner/OwnerPaymentPage";
import OwnerReservationPage from "@/pages/owner/OwnerReservationPage";
import OwnerStatisticspage from "@/pages/owner/OwnerStatisticspage";
import OwnerTruckDetail from "@/pages/owner/OwnerTruckDetailPage";
import { useAuthStore } from "@/stores/auth.store";
import React, { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

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
      <Route path="/" element={<Navigate to="/owner/trucks" replace />} />

      <Route
        path="/trucks"
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
            <OwnerReservationPage />
          </Layout>
        }
      />
      <Route
        path="/payments"
        element={
          <Layout showSidebar={true}>
            <OwnerPaymentPage />
          </Layout>
        }
      />
      <Route
        path="/statistics"
        element={
          <Layout showSidebar={true}>
            <OwnerStatisticspage />
          </Layout>
        }
      />

      <Route
        path="/trucks/:truckId"
        element={
          <Layout showSidebar={true}>
            <OwnerTruckDetail />
          </Layout>
        }
      />
    </Routes>
  );
}

export default OwnerRouter;
