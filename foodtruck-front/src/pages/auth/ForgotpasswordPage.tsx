import { authApi } from "@/apis/auth/auth.api";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

function ForgotpasswordPage() {
  const [name, setName] = useState<string>("");
  const [loginId, setLoginId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("")
  
  const navigate = useNavigate();

  const resetPasswordMutation = useMutation({
    mutationFn: () => authApi.resetPWEmail({name, loginId, email}),

    onSuccess: () => {
      setSuccess(true);
      alert("이메일 발송이 완료되었습니다.");
      navigate("/password/pending", {replace: true});
    },

    onError: (e) => setErrorMsg(getErrorMsg(e))
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccess(false);


    if(!name || !loginId || !email) {
      setErrorMsg("모든 정보를 입력해주세요");
      return;
    }

    if(!/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMsg("이메일 형식이 올바르지 않습니다.");
      return;
    }
    
    resetPasswordMutation.mutate();
  }

  return (
    <Container>
      <Title>비밀번호 찾기 / 재설정</Title>

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>이름</Label>
          <Input 
            type="text"
            value={name} 
            onChange={e => setName(e.target.value)}
            placeholder="이름을 입력해주세요."
          />
        </InputGroup>

        <InputGroup>
          <Label>아이디</Label>
          <Input
            type="text"
            value={loginId} 
            onChange={e => setLoginId(e.target.value)}
            placeholder="아이디를 입력해주세요."
          />
            
        </InputGroup>

        <InputGroup>
          <Label>이메일</Label>
          <Input 
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요"
          />
        </InputGroup>
        {errorMsg && <ErrorText>{errorMsg}</ErrorText>}
        <Button 
          type="submit"
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending
            ? "전송 중"
            : success
            ? "전송 완료"
            : "인증"}
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