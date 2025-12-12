import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <Container>
      <Title>로그인</Title>
      <Form>
        <InputContainer>
          <Label>아이디</Label>
          <Input type="text" name="username" value="" required></Input>
        </InputContainer>
        <InputContainer>
          <Label>비밀번호</Label>
          <Input type="password" name="password" value="" required></Input>
        </InputContainer>

        <LoginButton type="submit">로그인</LoginButton>
      </Form>
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
