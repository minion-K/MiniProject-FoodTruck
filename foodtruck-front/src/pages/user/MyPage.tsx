import styled from "@emotion/styled";
import React, { useEffect, useState, type ReactNode } from "react";
import Profile from "./Profile";
import MyReservation from "./MyReservation";
import MyPageSide from "./MyPageSide";
import { useLocation, useNavigate } from "react-router-dom";
import MyPayment from "./MyPayment";

interface MyPageTab {
  key: string;
  label: string;
  content?: React.ReactNode;
}

interface Props {
  tabs?: MyPageTab[];
  activeTab?: string;
  children?: React.ReactNode;
}

function MyPage({ tabs, activeTab, children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as { activeTab?: string } | undefined) ?? {};

  const params = new URLSearchParams(location.search);
  const queryActiveTab = params.get("activeTab");

  const [active, setActive] = useState<string>(
    activeTab ?? state.activeTab ?? queryActiveTab ?? "profile",
  );
  const [profileKey, setProfileKey] = useState<number>(Date.now());

  const defaultTabs: MyPageTab[] = [
    {
      key: "profile",
      label: "회원 정보",
      content: <Profile key={profileKey} />,
    },
    { key: "reservations", label: "예약 내역", content: <MyReservation /> },
    { key: "payments", label: "결제 내역", content: <MyPayment /> },
  ];

  const tab = tabs ?? defaultTabs;
  const currentTab = tab.find((t) => t.key === active);

  useEffect(() => {
    if (!state.activeTab) return;
    setActive(state.activeTab);

    if (state.activeTab === "profile") {
      sessionStorage.removeItem("profile-edit-draft");
      sessionStorage.removeItem("emailVerified");
      setProfileKey(Date.now());
    }
  }, [state.activeTab]);

  const handleChangeTab = (key: string) => {
    if (key === "profile") {
      sessionStorage.removeItem("profile-edit-draft");
      sessionStorage.removeItem("emailVerified");
      setProfileKey(Date.now());
    }

    setActive(key);

    if (children) {
      navigate(`/mypage?activeTab=${key}`, {
        replace: true,
        state: { activeTab: key },
      });
    }
  };

  return (
    <Container>
      <MyPageSide tabs={tab} active={active} onChange={handleChangeTab} />

      <Content>
        {active === "reservations" && children ? children : currentTab?.content}
      </Content>
    </Container>
  );
}

export default MyPage;

const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 60px);

  overflow: hidden;
`;

const Content = styled.main`
  flex: 1;
  padding: 32px;
  background-color: #fafafa;

  overflow-y: auto;
`;
