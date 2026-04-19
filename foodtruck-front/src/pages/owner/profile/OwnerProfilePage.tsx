import { userApi } from '@/apis/user/user.api';
import ProfileView from '@/components/profile/ProfileView';
import type { UserDetailResponse } from '@/types/user/user.dto';
import { getErrorMsg } from '@/utils/error';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function OwnerProfilePage() {
  const [user,setUser] = useState<UserDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    const fetchMe = async () => {
      try {
        const res = await userApi.me();
        setUser(res);
      } catch (e) {
        alert(getErrorMsg(e));
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  if(loading) return <Loading>내 정보 불러오는 중...</Loading>
  if(!user) return <Empty>회원 정보를 불러올 수 없습니다.</Empty>
  
  return (
    <Container>
      <ProfileView 
        user={user}
        onEdit={() => {
          navigate("/owner/profile/edit");
        }}
      />
    </Container>

  )
}

export default OwnerProfilePage

const Container = styled.div`
  flex: 1;
  padding: 32px;
  background-color: #fafafa;

  overflow-y: auto;
`;

const Loading = styled.div`
  color: #666;
`;

const Empty = styled.div`
  color: #888;
`;