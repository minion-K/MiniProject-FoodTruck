
import Layout from "@/components/layouts/Layout";
import TruckDetail from "@/pages/truck/TruckDetail";
import TruckList from "@/pages/truck/TruckList";
import TruckMap from "@/pages/truck/TruckMap";
import { Route, Routes } from "react-router-dom";

function TruckRouter() {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <Layout showSidebar={false}>
            <TruckList />
          </Layout>
        }
      />

      <Route 
        path="/trucks/:truckId" 
        element={
          <Layout showSidebar={false}>
            <TruckDetail />
          </Layout>
        }
      />
    </Routes>
  );
}

export default TruckRouter;
