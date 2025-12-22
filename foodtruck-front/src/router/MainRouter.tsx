import { Route, Routes } from "react-router-dom";
import TruckRouter from "./truck/TruckRouter";
import Layout from "@/components/layout/Layout";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import PendingPage from "@/pages/auth/PendingPage";

function MainRouter() {
  return (
    <Routes>
      <Route path="/login/*" element={<LoginPage />} />
      <Route path="/register/*" element={<RegisterPage />} />
      <Route path="/register/pending" element={< PendingPage/>} />
    
      <Route
        path="*"
        element={
          <Layout>
            <TruckRouter />
          </Layout>
        }
      />
    </Routes>
  );
}

export default MainRouter;
