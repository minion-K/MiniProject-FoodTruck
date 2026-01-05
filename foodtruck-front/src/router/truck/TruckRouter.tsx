import Layout from "@/components/layouts/Layout";
import TruckDetail from "@/pages/truck/TruckDetail";
import TruckList from "@/pages/truck/TruckList";
import MyPage from "@/pages/user/MyPage";
import ReservationDetailPage from "@/pages/user/ReservationDetailPage";
import { Route, Routes } from "react-router-dom";

function TruckRouter() {
  return (
    <Layout showSidebar={false}>
      <Routes>
        <Route 
          path="/" 
          element={<TruckList />}
        />

        <Route 
          path="/trucks/:truckId" 
          element={<TruckDetail />}
        />
        <Route
          path="/mypage"
          element={<MyPage />}
        >
        </Route>

        <Route 
          path="/mypage/reservation/:reservationId"
          element={<ReservationDetailPage />}
        />
      </Routes>

    </Layout>

  );
}

export default TruckRouter;
