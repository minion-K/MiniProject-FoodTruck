import Layout from '@/components/layouts/Layout';
import AdminPage from '@/pages/admin/AdminPage';
import { useAuthStore } from '@/stores/auth.store'
import React, { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom';

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
      <Route 
        path="/"
        element={
          <Layout showSidebar={true}>
            <AdminPage />
          </Layout>
        }
      />
    </Routes>
  )
}

export default AdminRouter
