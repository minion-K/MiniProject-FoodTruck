import { authApi } from '@/apis/auth/auth.api';
import { userApi } from '@/apis/user/user.api';
import type { UserDetailResponse, UserUpdateRequest } from '@/types/user/user.dto'
import { getErrorMsg } from '@/utils/error';
import { isValidPhoneNumber } from '@/utils/phone';
import styled from '@emotion/styled'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast';

interface Props {
  user: UserDetailResponse;

  onCancel: () => void;
  onComplete: (data: UserDetailResponse) => void;
}

function ProfileEdit({ user, onCancel, onComplete }: Props) {
  const [form, setForm] = useState<UserUpdateRequest>({
    name: user.name,
    phone: user.phone ?? "",
  });

  const isLocalUser = user.provider === "LOCAL";
  const isPhoneValid = isValidPhoneNumber(form.phone ?? "");
  const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email);
  }

  const [email, setEmail] = useState(user.email);
  const [emailChanged, setEmailChanged] = useState(false);
  const [emailSend, setEmailSend] = useState(false);
  const [emailVerified, setEmailVerified] = useState(() => {
    return sessionStorage.getItem("emailVerified") === "true";
  });

  const isProfileChanged = 
    form.name !== user.name ||
    (form.phone ?? "") !== (user.phone ?? "");
  const isChanged = isProfileChanged || emailVerified;

  useEffect(() => {
    sessionStorage.setItem(
      "profile-edit-draft",
      JSON.stringify({
        name: form.name,
        phone: form.phone,
        email
      })
    );
  }, [form, email]);
  
  useEffect(() => {
    setEmailChanged(email !== user.email);
  }, [email, user.email, isLocalUser]);

  useEffect(() => {
    if(email !== user.email) {
      setEmailVerified(false);
      setEmailSend(false);
      sessionStorage.removeItem("emailVerified");
    }
  }, [email, user.email]);

  const handleComplete = async () => {
    try {
      const request: UserUpdateRequest = {
        name: form.name,
        phone: form.phone?.trim() === "" ? null : form.phone,
      };

      const updated: UserDetailResponse = await userApi.updateMe(request);
      onComplete(updated);

      toast.success("회원 정보가 수정되었습니다.");
    } catch(err) {
      alert(getErrorMsg(err));
    }
  };

  const handleSendEmailAuth = async () => {
    if (!isLocalUser || !emailChanged) return;

    try {
      await authApi.sendEmailChange({email});
      setEmailSend(true);

      alert("인증 메일이 발송되었습니다.");
      window.location.href = "/mypage/pending";
    } catch (err) {
      alert(getErrorMsg(err));
    }
  };

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
        <Title>회원 정보 수정</Title>
      </Header>

      <Card>
        <InfoRow>
          <Label>이름</Label>
          <Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
        </InfoRow>

        <InfoRow>
          <Label>아이디</Label>
          <Input value={displayLoginId} disabled />
        </InfoRow>

        <InfoRow>
          <Label>이메일</Label>
          <ColWrapper>
            <EmailRow>
              <Input 
                value={email}
                disabled={!isLocalUser || emailVerified}
                onChange={(e) => setEmail(e.target.value)}
              />
              {isLocalUser && !emailVerified && (
                <AuthButton 
                  onClick={handleSendEmailAuth}
                  disabled={!emailChanged || emailSend || !isValidEmail(email)}
                >
                  인증
                </AuthButton>
              )}

              {emailVerified && (
                <CompletedVerified>
                  인증 완료
                </CompletedVerified>
              )}
            </EmailRow>

            {emailChanged && !isValidEmail(email) && (
              <HelpText>
                올바른 이메일 형식을 입력해주세요.
              </HelpText>
            )}

            {emailVerified && (
              <VerifiedText>
                ✅이메일 인증이 완료되었습니다.
              </VerifiedText>
            )}

            {!isLocalUser && (
              <HelpText>
                소셜 로그인은 이메일을 변경할 수 없습니다.
              </HelpText>
            )}
          </ColWrapper>
        </InfoRow>

        <InfoRow>
          <Label>전화번호</Label>

          <ColWrapper>
            <Input 
              value={form.phone ?? ""} 
              onChange={(e) => {
                const onlyNumber = e.target.value.replace(/\D/g, "");
                
                setForm({
                  ...form, 
                  phone: e.target.value === "" ? null : onlyNumber
                })
              }} 
            />

            {!isPhoneValid && (
              <HelpText>
                전화번호는 숫자만 입력하며 10~11자리여야 합니다.
              </HelpText>
            )}
          </ColWrapper>
        </InfoRow>

        <ButtonRow>
          <CancelButton onClick={onCancel}>취소</CancelButton>
          <SaveButton 
            onClick={handleComplete} 
            disabled={!isChanged || !isPhoneValid}
          >
            수정
          </SaveButton>
        </ButtonRow>
      </Card>
    </Container>
  )
}

export default ProfileEdit

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
`;

const Header = styled.div``;

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
  align-items: center;
  padding: 12px 0;

  &:not(:last-of-type) {
    border-bottom: 1px solid #f0f0f0;
  }
`;

const Label = styled.div`
  min-width: 80px;
  font-size: 14px;
  color: #777;
`;

const Input = styled.input`
  flex: 1;
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ddd;
  outline: none;

  &:focus {
    border-color: #aaa;
  }
`;

const ColWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
`;

const EmailRow = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  gap: 8px;
`;

const HelpText = styled.div`
  font-size: 12px;
  color: #e53935;
  margin-left: 2px;
`;

const VerifiedText = styled.div`
  font-size: 12px;
  color: #2e7d32;
  margin-left: 2px;
;`;

const AuthButton = styled.button`
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 8px;
  border: 1px solid #1976d2;
  background-color: #1976d2;
  color: #fff;
  cursor: pointer;

  &:disabled {
    background-color: #e0e0e0;
    border-color: #ddd;
    color: #aaa;
    cursor: not-allowed;
  }
`;

const CompletedVerified = styled.div`
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 8px;
  border: 1px solid #c8e6c9;
  background-color: #e8f5e9;
  color: #2e7d32;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
`;

const CancelButton = styled.button`
  padding: 6px 16px;
  font-size: 13px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const SaveButton = styled.button`
  padding: 6px 16px;
  font-size: 13px;
  border-radius: 8px;
  border: 1px solid #4caf50;
  background-color: #4caf50;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #c8e6c9;
    border-color: #c8e6c9;
    color: #777;
    cursor: not-allowed;
  }
`;