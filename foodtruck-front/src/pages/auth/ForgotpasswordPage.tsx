import { authApi } from "@/apis/auth/auth.api";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

function ForgotpasswordPage() {
  const [name, setName] = useState("");
  const [loginId, setLoginId] = useState("");
  const [email, setEmail] = useState("");
  
  const navigate = useNavigate();

  const handleSendEmail = async () => {
    if(!name || !loginId || !email) {
      alert("모든 정보를 입력해주세요");
      
      return;
    }

    try {
      await authApi.resetPWEmail({name, loginId, email});

      alert("이메일 발송이 완료되었습니다.")
      navigate("/password/pending", {replace: true})
    } catch (e) {
      alert(getErrorMsg(e));
    }

    
  }

  return (
    <Container>
      <Title>비밀번호 찾기 / 재설정</Title>

      <Form>
        <InputGroup>
          <Label>이름</Label>
          <Input 
            type="text"
            value={name} 
            onChange={e => setName(e.target.value)}
            required
            placeholder="이름을 입력해주세요"
          />
        </InputGroup>

        <InputGroup>
          <Label>아이디</Label>
          <Input
            type="text"
            value={loginId} 
            onChange={e => setLoginId(e.target.value)}
            required
            placeholder="아이디를 입력해주세요"
          />
            
        </InputGroup>

        <InputGroup>
          <Label>이메일</Label>
          <Input 
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="이메일을 입력해주세요"
          />
        </InputGroup>

        <Button type="button" onClick={handleSendEmail}>
          인증
        </Button>
      </Form>
    </Container>
  )
}

export default ForgotpasswordPage

const Container = styled.div`
  max-width: 380px;
  margin: 60px auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 14px;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #bbb;
  outline: none;

  &:focus {
    border-color: #1b73e8;
  }
`;

const Button = styled.button`
  padding: 12px;
  background: #1b73e8;
  color: white;
  border-radius: 8px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #0b5ac2;
  }
`;

const ErrorText = styled.p`
  color: #eb2222;
  font-size: 13px;
`;