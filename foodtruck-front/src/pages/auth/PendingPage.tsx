import { useRegisterStore } from '@/stores/register.store';
import styled from '@emotion/styled';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function PendingPage() {
  const navigate = useNavigate();
  const {step} = useRegisterStore();
  
  useEffect(() => {
    if(step !== "EMAIL_SENT") {
      navigate("/register", {replace: true});
    }
  }, [step, navigate])
  
  return (
    <Container>
      <Card>
        <Icon>💌</Icon>

        <Title>이메일 인증 대기 중</Title>

        <Description>
          
              입력하신 이메일로 인증 메일을 발송했습니다. <br />
              이메일에 포함된 인증 버튼을 클릭해주세요.
        </Description>

        <Notice>
          해당 페이지는 닫지 말아주세요.
        </Notice>
      </Card>
    </Container>
  )
}

export default PendingPage

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8f9fb;
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 32px 24px;
  background: white;
  border-radius: 12px;
`;

const Icon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const Title = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 12px;
`;

const Description = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: #333;
`;

const Notice = styled.p`
  margin-top: 20px;
  font-size: 0.85rem;
  color: #777;
`;