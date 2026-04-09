import { authApi } from "@/apis/auth/auth.api";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from 'react'
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();
  const verifyRef = useRef(false);

  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  useEffect(() => {
    if(verifyRef.current) return;
    verifyRef.current = true;

    if(!token) {
      alert("잘못된 접근입니다.");
      navigate("/login");

      return;
    };

    const verifyToken = async () => {
      try {
        const isValid = await authApi.passwordVerify(token);

        if(!isValid) {
          alert("유효하지 않거나 만료된 링크입니다.");
          navigate("/login");
        } else {
          alert("이메일 인증이 완료되었습니다.");

          window.history.replaceState({}, "/reset-password");
        }
      } catch (e) {
        alert(getErrorMsg(e));
        navigate("/login");
      }
    };

    verifyToken();
  }, [token, navigate]);

  const resetMutation = useMutation({
    mutationFn: () => authApi.resetPW({token: token!, newPassword, confirmPassword}),

    onSuccess: () => {
      toast.success("비밀번호가 성공적으로 변경되었습니다.");
      navigate("/login");
    },

    onError: (e) => setErrorMsg(getErrorMsg(e))
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if(!newPassword || !confirmPassword) {
      setErrorMsg("비밀번호를 모두 입력해주세요.");
      return;
    }

    if(!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()+=-]).{8,16}$/.test(newPassword)) {
      setErrorMsg("비밀번호는 영문, 숫자, 특수문자 포함 8~16자여야 합니다.");
      return;
    }

    if(newPassword !== confirmPassword) {
      setErrorMsg("비밀번호가 일치하지 않습니다.");
      return;
    }


    resetMutation.mutate();
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
            placeholder="비밀번호 입력"
          />
        </InputGroup>

        <InputGroup>
          <Label>비밀번호 확인</Label>
          <Input 
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호 다시 입력"
          />
        </InputGroup>

        {errorMsg && <ErrorText>{errorMsg}</ErrorText>}
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