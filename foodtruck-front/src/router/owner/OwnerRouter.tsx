import Layout from '@/components/layouts/Layout';
import OwnerPage from '@/pages/owner/OwnerPage';
import { useAuthStore } from '@/stores/auth.store'
import React, { useEffect } from 'react'
import { replace, Route, Routes, useNavigate } from 'react-router-dom';

function OwnerRouter() {
  const {user} = useAuthStore();
  const navigate = useNavigate();

  console.log("USER:", user);
  console.log("ROLES:", user?.roles, typeof user?.roles);

  useEffect(() => {
    if(!user) {
      navigate("/", {replace: true});
      
      return;
    }

    if(!user?.roles.includes("OWNER")) {
      navigate("/", {replace: true});
    }
  }, [user, navigate])

  if(!user || !user.roles.includes("OWNER")) {
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
    </Routes>
  );
}

export default OwnerRouter
