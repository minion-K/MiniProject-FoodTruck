import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import styled from "@emotion/styled";
import { useAuthStore } from "@/stores/auth.store";

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  role?: "OWNER" | "ADMIN";
}

function Layout({ children, showSidebar = false, role}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const {user, showAlert, setShowAlert} = useAuthStore();
  const alertRef = useRef(false);

  useEffect(() => {
    if(!user || user.status === "ACTIVE" || !showAlert || alertRef.current) return;

    alertRef.current = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        alert("정지로 인해 서비스 이용이 제한된 회원입니다.");
        setShowAlert(false);
      });
    });
  }, [user, showAlert]);

  const handleToggleSidebar = () => {
    if(!showSidebar) return;
    setSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <Container>
      <Header onToggleSidebar={handleToggleSidebar} />
      <MainContainer>
        {showSidebar && (
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={handleCloseSidebar} 
            role={role}
          />
        )}
        
        <Main>{children}</Main>
      </MainContainer>
    </Container>
  );
}

export default Layout;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;
const MainContainer = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  transition: all 0.25s ease;
`;

const Main = styled.div`
  display: flex;
  flex: 1;
  /* padding: 20px 50px; */

  flex-direction: column;
  overflow-y: auto;
  gap: 16px;
`;
