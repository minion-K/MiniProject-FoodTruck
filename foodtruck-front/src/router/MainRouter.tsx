import { Route, Routes } from "react-router-dom";
import TruckRouter from "./truck/TruckRouter";
import Layout from "@/components/layouts/Layout";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import PendingPage from "@/pages/auth/PendingPage";
import OAuth2CallbackPage from "@/pages/auth/OAuth2CallbackPage";
import { useAuthStore } from "@/stores/auth.store";
import OwnerRouter from "./owner/OwnerRouter";
import AdminRouter from "./admin/AdminRouter";
import ProfilePendingPage from "@/pages/auth/ProfilePendingPage";

function MainRouter() {
  const {user, isInitialized} = useAuthStore();
  if(!isInitialized) return null;

  const role = user?.roles;

  const isAdmin = role?.includes("ADMIN");
  const isOwner = role?.includes("OWNER");

  return (
    <Routes>
      <Route path="/login/*" element={<LoginPage />} />
      <Route path="/register/*" element={<RegisterPage />} />
      <Route path="/register/pending" element={<PendingPage />} />
      <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />
    
      <Route path="mypage/pending" element={<ProfilePendingPage />}/>

      <Route path="/*" element={<TruckRouter />} />
      {isOwner && <Route path="/owner/*" element={<OwnerRouter />} />}
      {isAdmin && <Route path="/admin/*" element={<AdminRouter />} />}
    </Routes>
  );
}

export default MainRouter;
