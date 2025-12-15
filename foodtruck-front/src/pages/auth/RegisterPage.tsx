import { authApi } from "@/apis/auth/auth.api";
import type { SignupRequest } from "@/types/auth/auth.dto";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  //% Hooks
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [form, setForm] = useState<SignupRequest>({
    name: "",
    loginId: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
  });

  //% Handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (form.password != form.confirmPassword) {
      setErrorMsg("비밀번호와 비밀번호 확인이 일치하지 않습니다.");

      return;
    }

    signupMutation.mutate();
  };

  //% Mutation
  const signupMutation = useMutation({
    mutationFn: () => authApi.signup(form),

    onSuccess: () => {
      alert("이메일 인증 후 로그인 해주세요");
      navigate("/login");
    },

    onError: (err) => {
      setErrorMsg(getErrorMsg(err));
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("verified") === "true") {
      setIsVerified(true);
      alert("이메일 인증이 완료되었습니다.");

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <Container>
      <Title>회원가입</Title>
      <Form onSubmit={handleSubmit}>
        <InputContainer>
          <Label>이름 *</Label>
          <Input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </InputContainer>

        <InputContainer>
          <Label>아이디 *</Label>
          <Input
            type="text"
            name="loginId"
            value={form.loginId}
            onChange={handleChange}
            required
          />
        </InputContainer>

        <InputContainer>
          <Label>비밀번호 *</Label>
          <Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </InputContainer>

        <InputContainer>
          <Label>비밀번호 확인*</Label>
          <Input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </InputContainer>

        <InputContainer>
          <Label>이메일 *</Label>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          {isVerified && "이메일 인증 완료"}
        </InputContainer>

        <InputContainer>
          <Label>휴대폰 번호</Label>
          <Input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </InputContainer>

        {errorMsg && <ErrorText>{errorMsg}</ErrorText>}

        <Button disabled={signupMutation.isPending}>
          {signupMutation.isPending ? "처리 중..." : "회원가입"}
        </Button>

        <LinkBox>
          <Link to="/login">이미 계정이 있으신가요? 로그인</Link>
        </LinkBox>
      </Form>
    </Container>
  );
}

export default RegisterPage;

const Container = styled.div`
  max-width: 420px;
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
  gap: 10px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #bbb;
`;

const Label = styled.label``;

const ErrorText = styled.p`
  color: #eb2222;
  font-size: 0.9rem;
`;

const Button = styled.button`
  padding: 12px;
  background-color: #1b73e8;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  transition: 0.3s background ease;

  &:hover {
    background-color: #0b5ac2;
  }
`;

const LinkBox = styled.div`
  margin-top: 20px;
  text-align: center;

  a {
    color: #1b73e8;
  }

  a:hover {
    text-decoration: underline;
  }
`;
