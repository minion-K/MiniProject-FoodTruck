import { authApi } from "@/apis/auth/auth.api";
import { userApi } from "@/apis/user/user.api";
import SocialLoginButton from "@/components/SocialLoginButton";
import { useAuthStore } from "@/stores/auth.store";
import type { LoginRequest } from "@/types/auth/auth.dto";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const setAccessToken = useAuthStore(s => s.setAccessToken);
  const setUser = useAuthStore(s => s.setUser);

  const [form, setForm] = useState<LoginRequest>({
    loginId: "",
    password: ""
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({...prev, [e.target.name]: e.target.value}));
  }

  // 로그인 fetch
  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await authApi.login(form);

      if(!res) {
        throw new Error("로그인 정보가 올바르지 않습니다.");
      }

      setAccessToken(res.accessToken);
        
      const me = await userApi.me();
      if(!me) {
        throw new Error("유저 정보 조회 실패: 데이터가 없습니다");
      }

      setUser(me);
    },
    onSuccess: () => {
      navigate("/")
    },
    onError: (err: any) => {
      setErrorMsg(getErrorMsg(err, "로그인에 실패하였습니다."))
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if(!form.loginId || !form.password) {
      setErrorMsg("아이디와 비밀번호를 입력해주세요");
      
      return;
    }
    
    loginMutation.mutate();
  }

  return (
    <Container>
      <Title>로그인</Title>
      <Form onSubmit={handleSubmit}>
        <InputContainer>
          <Label>아이디</Label>
          <Input 
            type="text"
            name="loginId"
            value={form.loginId}
            onChange={handleChange}
            required />
        </InputContainer>
        <InputContainer>
          <Label>비밀번호</Label>
          <Input 
            type="password" 
            name="password" 
            value={form.password}
            onChange={handleChange}
            required
          />
        </InputContainer>

        {errorMsg && <ErrorText>{errorMsg}</ErrorText>}

        <LoginButton type="submit">로그인</LoginButton>
      </Form>

      <SocialLoginButton />

      <LinkContainer>
        <Link to="/register">회원가입</Link>
        <Link to="/forgot-password">비밀번호 찾기</Link>
      </LinkContainer>
    </Container>
  );
}

export default LoginPage;

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
  gap: 18px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label``;

const Input = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #bbb;
`;

const ErrorText = styled.p`
  color: eb2222;
  font-size: 0.9rem;
  margin-top: -8px;
`;

const LoginButton = styled.button`
  padding: 12px;
  background-color: #1b73e8;
  color: white;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: 0.3s background ease;

  &:hover {
    background-color: #0b5ac2;
  }
`;

const LinkContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;

  a {
    color: #1b73e8;
  }

  a:hover {
    text-decoration: underline;
  }
`;
