
import { authApi } from "@/apis/auth/auth.api";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

function FindIdpage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("")

  const navigate = useNavigate();

  const findIdMutation = useMutation({
    mutationFn: () => authApi.findId({name, email}),

    onSuccess: (res) => {
      setResult(res.loginId);
    },

    onError: (e) => {
      setErrorMsg(getErrorMsg(e));
    }
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setResult("");

    if(!name || !email) {
      setErrorMsg("아이디와 이메일을 입력해주세요")
      return;
    };

    if(!/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMsg("이메일 형식이 올바르지 않습니다.");
      return;
    }

    findIdMutation.mutate();
  }

  return (
    <Container>
      <Title>아이디 찾기</Title>

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>이름</Label>
          <Input 
            type="text"
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="이름을 입력해주세요."
            disabled={!!result}
          />
        </InputGroup>

        <InputGroup>
          <Label>이메일</Label>
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요."
            disabled={!!result}
          />
        </InputGroup>

        {errorMsg && <ErrorText>{errorMsg}</ErrorText>}

        <Button 
          type="submit"
          disabled={findIdMutation.isPending || !!result}
        >
          {findIdMutation.isPending 
          ? "찾는 중..." 
          : result
          ? "조회 완료"
          :"아이디 찾기"}
        </Button>


        {result && (
          <ResultCard>
            <SuccessText>아이디를 찾았습니다!</SuccessText>
            <IdBox>{result}</IdBox>
            <SubText>로그인 화면에서 아이디를 입력해주세요.</SubText>
            <LoginText onClick={() => navigate("/login")}>
              로그인 페이지로 이동 →
            </LoginText>
          </ResultCard>
        )}
      </Form>
    </Container>
  )
}

export default FindIdpage

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

  &:disabled {
    background: #bbb;
    cursor: not-allowed;
    color: #666;
  }
`;

const ResultCard = styled.div`
  margin-top: 24px;
  padding: 20px;
  border-radius: 12px;
  background: #f0f7ff;
  border: 1px solid #db3afe;
  text-align: center;
`;

const SuccessText = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #1d4ed8;
  margin-bottom: 12px;
`;

const IdBox = styled.div`
  font-size: 20px;
  font-weight: 900;
  color: #111;
  background: white;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 12px;
`;

const SubText = styled.p`
  font-size: 13px;
  color: #666;
`;

const LoginText = styled.p`
  font-size: 13px;
  color: #1b73e8;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorText = styled.p`
  color: #eb2222;
  font-size: 14px;
`;