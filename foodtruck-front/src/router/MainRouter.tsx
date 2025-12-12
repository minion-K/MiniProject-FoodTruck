import { Route, Routes } from "react-router-dom";
import TruckRouter from "./truck/TruckRouter";
import Layout from "@/components/layout/Layout";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

function MainRouter() {
  return (
    <Routes>
      <Route path="/login/*" element={<LoginPage />} />
      <Route path="/register/*" element={<RegisterPage />} />

      <Route path="*" element={<Layout><TruckRouter /></Layout>} />
    </Routes>
  );
}

export default MainRouter;
