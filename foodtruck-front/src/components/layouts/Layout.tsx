import React, { useState } from "react";
import Header from "./Header";
import Navibar from "./Navibar";
import Sidebar from "./Sidebar";
import styled from "@emotion/styled";

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

function Layout({ children, showSidebar =false}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

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
      {/* <Navibar /> */}
      <MainContainer>
        <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
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
  padding: 20px 50px;

  flex-direction: column;
  overflow-y: auto;
  gap: 16px;
`;
