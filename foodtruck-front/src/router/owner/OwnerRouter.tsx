import Layout from "@/components/layouts/Layout";
import OwnerPage from "@/pages/owner/truck/OwnerPage";
import OwnerReservationPage from "@/pages/owner/reservation/OwnerReservationPage";
import OwnerStatisticspage from "@/pages/owner/ststistics/OwnerStatisticspage";
import OwnerTruckDetail from "@/pages/owner/truck/OwnerTruckDetailPage";
import { useAuthStore } from "@/stores/auth.store";
import React, { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import OwnerProfilePage from "@/pages/owner/profile/OwnerProfilePage";
import OwnerProfileEditPage from "@/pages/owner/profile/OwnerProfileEditPage";

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
      <Route path="/" element={<Navigate to="/owner/profile" replace />} />

      <Route
        path="/profile"
        element={
          <Layout showSidebar={true} role="OWNER">
            <OwnerProfilePage />
          </Layout>
        }
      />

      <Route
        path="/profile/edit"
        element={
          <Layout showSidebar={true} role="OWNER">
            <OwnerProfileEditPage />
          </Layout>
        }
      />

      <Route
        path="/trucks"
        element={
          <Layout showSidebar={true} role="OWNER">
            <OwnerPage />
          </Layout>
        }
      />
      <Route
        path="/reservations"
        element={
          <Layout showSidebar={true} role="OWNER">
            <OwnerReservationPage />
          </Layout>
        }
      />
      <Route
        path="/statistics"
        element={
          <Layout showSidebar={true} role="OWNER">
            <OwnerStatisticspage />
          </Layout>
        }
      />

      <Route
        path="/trucks/:truckId"
        element={
          <Layout showSidebar={true} role="OWNER">
            <OwnerTruckDetail />
          </Layout>
        }
      />
    </Routes>
  );
}

export default OwnerRouter;
