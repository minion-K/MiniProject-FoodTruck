import { authApi } from '@/apis/auth/auth.api';
import { userApi } from '@/apis/user/user.api';
import ProfileEdit from '@/components/profile/ProfileEdit';
import ProfileView from '@/components/profile/ProfileView';
import type { UserDetailResponse } from '@/types/user/user.dto'
import { getErrorMsg } from '@/utils/error';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'

function Profile() {
  const [user, setUser] = useState<UserDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [updateduser, setUpdatedtUser] = useState<UserDetailResponse | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const data = await userApi.me();

        setUser(data);
        setUpdatedtUser(data);
      } catch (err) {
        getErrorMsg(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  useEffect(() => {
    const draft = sessionStorage.getItem("profile-edit-draft");
    if(!draft) return;

    const parse = JSON.parse(draft);

    setUpdatedtUser(prev => {
      if(!prev) return prev;

      return {
        ...prev,
        name: parse.name ?? prev.name,
        email: parse.email ?? prev.email,
        phone: parse.phone ?? prev.phone
      };
    });

    setMode("edit");
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if(!token || !updateduser) return ;

    handleEmailToken(token);
  }, [updateduser]);

  const handleEmailToken = async (token: string) => {
    if(!updateduser) return;

    const handleKey = `email-verified:${token}`;
    if(sessionStorage.getItem(handleKey)) return;
    sessionStorage.setItem(handleKey, "true");

    try {
      await authApi.confirmEmailChange(token);

      const refreshed = await userApi.me();

      sessionStorage.setItem("emailVerified", "true");
      setUpdatedtUser(refreshed);

      alert("이메일 인증이 완료되었습니다.");
      window.history.replaceState({}, "", "/mypage");

      setMode("edit");
    } catch (err) {
      alert(getErrorMsg(err));
    }
  };

  const handleEdit = () => {
    sessionStorage.removeItem("emailVerified");
    if(updateduser) setMode("edit");
  };

  const handleCancel = () => {
    sessionStorage.removeItem("profile-edit-draft");
    sessionStorage.removeItem("emailVerified");

    if(updateduser && user) setUpdatedtUser(user);
    setMode("view");
  };

  const handleComplete = async (user: UserDetailResponse) => {
    sessionStorage.removeItem("profile-edit-draft");

    setUser(user);
    setUpdatedtUser(user)
    setMode("view");
  }

  if(loading) return <Loading>회원 정보 불러오는 중...</Loading>
  if(!user || !updateduser) return <Empty>회원 정보를 불러올 수 없습니다.</Empty>

  return mode === "view" ? (
    <ProfileView user={user} onEdit={handleEdit}/>
  ) : (
    <ProfileEdit 
      user={updateduser} 
      onCancel={handleCancel} 
      onComplete={handleComplete}
    />
  )
    
}

export default Profile

const Loading = styled.div`
  color: #666;
`;

const Empty = styled.div`
  color: #888;
`;
