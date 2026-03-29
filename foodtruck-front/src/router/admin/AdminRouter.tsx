import Layout from '@/components/layouts/Layout';
import AdminReservationPage from '@/pages/admin/reservation/AdminReservationPage';
import AdminStatisticsPage from '@/pages/admin/statistics/AdminStatisticsPage';
import AdminTruckPage from '@/pages/admin/truck/AdminTruckPage';
import AdminUserPage from '@/pages/admin/user/AdminUserPage';
import AdminPage from '@/pages/admin/user/AdminUserPage';
import { useAuthStore } from '@/stores/auth.store'
import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

function AdminRouter() {
  const {user} = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if(!user) {
      navigate("/", {replace: true});

      return;
    }

    if(!user.roles.includes("ADMIN")) {
      navigate("/", {replace: true});
    }
  }, [user, navigate]);

  if(!user || !user.roles.includes("ADMIN")) {
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/users" replace />} />

      <Route 
        path="/users"
        element={
          <Layout showSidebar={true} role="ADMIN">
            <AdminUserPage />
          </Layout>
        }
      />

      <Route 
        path="/trucks"
        element={
          <Layout showSidebar={true} role="ADMIN">
            <AdminTruckPage />
          </Layout>
        }
      />

      <Route 
        path="/reservations"
        element={
          <Layout showSidebar={true} role="ADMIN">
            <AdminReservationPage />
          </Layout>
        }
      />

      <Route 
        path="/statistics"
        element={
          <Layout showSidebar={true} role="ADMIN">
            <AdminStatisticsPage />
          </Layout>
        }
      />
    </Routes>
  )
}

export default AdminRouter
