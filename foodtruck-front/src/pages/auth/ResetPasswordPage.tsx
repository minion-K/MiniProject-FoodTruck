import { authApi } from "@/apis/auth/auth.api";
import type { PasswordResetRequest } from "@/types/auth/auth.dto";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import React, { useEffect, useState } from 'react'
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<Partial<Record<keyof PasswordResetRequest, string>>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Partial<Record<keyof PasswordResetRequest, boolean>>>({});

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if(!token) {
      navigate("/login");

      return;
    };

    const verify = async () => {
      try {
        const isValid = await authApi.passwordVerify(token);

        if(!isValid) {
          alert("유효하지 않거나 만료된 링크입니다.");
          navigate("/login");
        } 
      } catch (e) {
        alert(getErrorMsg(e));
      }
    };

    verify();
  }, [location, navigate]);

  const validate = (name: keyof PasswordResetRequest, value: string) => {
      let msg = "";
  
      if(name === "newPassword") {
        if(!value) msg = "비밀번호를 입력해주세요."
        else if(!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()+=-]).{8,16}$/.test(value)) {
          msg = "비밀번호는 영문, 숫자, 특수문자 포함 8~16자여야 합니다.";
        }
      }

      if(name === "confirmPassword") {
        if(!value) msg = "비밀번호 확인을 입력해주세요."
        else if(value !== newPassword) msg = "비밀번호와 일치하지 않습니다.";
      }
  
      setErrorMsg(prev => ({...prev, [name]: msg}));
      return msg;
  }

  const handleblur = (name: keyof PasswordResetRequest) => {
      setTouched(prev => ({...prev, [name]: true}));

      const value = name === "newPassword" ? newPassword : confirmPassword;
      validate(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    const newPasswordError = validate("newPassword", newPassword);
    const confirmPasswordError = validate("confirmPassword", confirmPassword);

    if(newPasswordError || confirmPasswordError) {
      hasError = true;
    }

    if(hasError) return;
    setGlobalError(null);

    try {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");

      if(!token) {
        setGlobalError("잘못된 접근입니다.");

        return;
      }

      await authApi.resetPW({token, newPassword, confirmPassword});

      toast.success("비밀번호가 성공적으로 변경되었습니다.");
      navigate("/login");
    } catch (e) {
      alert(getErrorMsg(e));
    }
  };

  return (
    <Container>
      <Title>비밀번호 재설정</Title>

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>새 비밀번호</Label>
          <Input 
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onBlur={() => handleblur("newPassword")}
            required
            placeholder="비밀번호 입력"
          />
          {touched.newPassword && errorMsg.newPassword && (
            <ErrorText>{errorMsg.newPassword}</ErrorText>
          )}
        </InputGroup>
        <InputGroup>
          <Label>비밀번호 확인</Label>
          <Input 
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => handleblur("confirmPassword")}
            required
            placeholder="비밀번호 다시 입력"
          />
          {touched.confirmPassword && errorMsg.confirmPassword && (
            <ErrorText>{errorMsg.confirmPassword}</ErrorText>
          )}
        </InputGroup>
        {globalError && <ErrorText>{globalError}</ErrorText>}
        <Button type="submit">비밀번호 변경</Button>
      </Form>
    </Container>
  )
}

export default ResetPasswordPage

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