import React, { useState } from "react";
import Header from "./Header";
import Navibar from "./Navibar";
import Sidebar from "./Sidebar";
import styled from "@emotion/styled";

function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <Container>
      <Header onToggleSidebar={handleToggleSidebar} />
      <Navibar />
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
  overflow-y: hidden;
  gap: 16px;
`;
