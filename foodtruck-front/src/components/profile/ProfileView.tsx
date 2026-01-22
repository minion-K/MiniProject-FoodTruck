import type { UserDetailResponse } from '@/types/user/user.dto'
import { getRoleLabels } from '@/utils/role';
import styled from '@emotion/styled';
import React, { useMemo } from 'react'

interface Props {
  user: UserDetailResponse;
  onEdit: () => void;
}

function ProfileView({user, onEdit}: Props) {
  const displayLoginId = useMemo(() => {
  if(user.provider === "LOCAL") {
    return user.loginId;
  }

  switch(user.provider) {
    case "GOOGLE":
      return "구글 로그인";
    case "KAKAO":
      return "카카오 로그인";
    case "NAVER":
      return "네이버 로그인";
    default:
      return "-";
  }
}, [user.provider, user.loginId]);

  return (
    <Container>
      <Header>
        <Title>회원 정보</Title>
        <EditButton onClick={onEdit}>수정</EditButton>
      </Header>

      <Card>
        <InfoRow>
          <Label>이름</Label>
          <Value>{user.name}</Value>
        </InfoRow>

        <InfoRow>
          <Label>아이디</Label>
          <Value>{displayLoginId}</Value>
        </InfoRow>

        <InfoRow>
          <Label>이메일</Label>
          <Value>{user.email}</Value>
        </InfoRow>

        <InfoRow>
          <Label>전화번호</Label>
          <Value>{user.phone ?? "-"}</Value>
        </InfoRow>

        <InfoRow>
          <Label>권한</Label>
          <Value>{getRoleLabels(user.roles)}</Value>
        </InfoRow>
      </Card>
    </Container>
  )
}

export default ProfileView

const Container = styled.div`
display: flex;
flex-direction: column;
gap: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
`;

const Card = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #eee;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const InfoRow = styled.div`
  display: flex;
  padding: 14px 0;
  align-items: center;

  &:not(:last-of-type) {
    border-bottom: 1px solid #f0f0f0;
  }
`;

const Label = styled.div`
  min-width: 80px;
  font-size: 14px;
  color: #777;
`;

const Value = styled.div`
  font-size: 14px;
  color: #222;
  font-weight: 500;
`;

const EditButton = styled.button`
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #f4f8ff;
  color: #3b6fe8;
  cursor: pointer;

  &:hover {
    background-color: #eaf2ff;
    border-color: #b6d3ff;
  }

  &:active {
    background-color: #eaf2ff;
    border-color: #b6d3ff;
  }
`;

const Loading = styled.div`
  color: #666;
`;

const Empty = styled.div`
  color: #888;
`;
