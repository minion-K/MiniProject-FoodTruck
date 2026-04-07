import { authApi } from "@/apis/auth/auth.api";
import { useRegisterStore } from "@/stores/register.store";
import type { SignupRequest } from "@/types/auth/auth.dto";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
``
function RegisterPage() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<Partial<Record<keyof SignupRequest, string>>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const {form, step, setField, setStep, reset} = useRegisterStore();
  const [touched, setTouched] = useState<Partial<Record<keyof SignupRequest, boolean>>>({});

  const isVerified = step === "VERIFIED";

  const validate = (name: keyof SignupRequest, value: string) => {
    let msg = "";

    switch(name) {
      case "name":
        if(!value) msg = "이름을 입력해주세요.";
        else if(value.length > 50) msg = "이름은 50자 이내로 입력해주세요.";
        break;
      case "loginId":
        if(!value) msg = "아이디를 입력해주세요.";
        else if(!/^(?=.*[A-Za-z])(?=.*\d)([A-Za-z\d]){4,20}$/.test(value))
          msg = "아이디는 영문, 숫자 포함 4~20자여야 합니다.";
        break;
      case "password":
        if(!value) msg = "비밀번호를 입력해주세요.";
        else if(!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()+=-]).{8,16}$/.test(value))
          msg = "비밀번호는 영문, 숫자, 특수문자 포함 8~16자여야 합니다.";
        break;
      case "confirmPassword":
        if(!value) msg = "비밀번호 확인을 해주세요.";
        else if(value !== form.password) msg = "비밀번호와 일치하지 않습니다.";
        break;
      case "email":
        if(!value) msg = "이메일을 입력해주세요."
        else if(!/^\S+@\S+\.\S+$/.test(value)) msg = "올바른 이메일 형식으로 입력해주세요."
        break;
      case "phone":
        if(value && !/^\d{10,11}$/.test(value)) msg = "휴대폰 번호는 10~11자리로 입력해주세요."
        break;
    }

    setErrorMsg(prev => ({...prev, [name]: msg}));
    return msg;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setField(name as keyof SignupRequest, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    (Object.keys(form) as (keyof SignupRequest)[]).forEach(key => {
      const msg = validate(key, form[key]);

      if(msg) hasError = true;
    });

    if(!isVerified) {
      setGlobalError("이메일 인증을 먼저 완료해주세요");
      return;
    }

    if (form.password != form.confirmPassword) {
      setGlobalError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if(hasError) return;

    signupMutation.mutate();
  };

  //% Mutation
  const emailMutation = useMutation({
    mutationFn: () => authApi.sendEmail({email: form.email}),

    onSuccess: () => {
      setStep("EMAIL_SENT");
      navigate("/register/pending", {replace: true})
    },
    onError: (err) => {
      setErrorMsg(getErrorMsg(err));
    }
  });

  const signupMutation = useMutation({
    mutationFn: () => authApi.signup(form),

    onSuccess: () => {
      alert("회원가입을 완료했습니다. 로그인 해주세요.");
      reset();
      navigate("/login");
    },

    onError: (err) => {
      setErrorMsg(getErrorMsg(err));
    },
  });

  const handleblur = (name: keyof SignupRequest) => {
    setTouched(prev => ({...prev, [name]: true}));
    validate(name, form[name]);
  }

  useEffect(() => {
    const verify = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
  
      if(token) {
        const handleToken = `email-verified: ${token}`;

        if(!sessionStorage.getItem(handleToken)) {
          try {
            await authApi.verifyEmail(token);

            sessionStorage.setItem(handleToken, "true");
            setStep("VERIFIED");
            alert("이메일 인증이 완료되었습니다.");
          } catch (e) {
            alert(getErrorMsg(e));
          }
        }

        window.history.replaceState({}, document.title, "/register");
      } else {
        reset();
        setStep("FORM");
        sessionStorage.clear();
      }
    };

    verify();
  }, [setStep, reset]);

  return (
    <Container>
      <Title>회원가입</Title>
      <Form onSubmit={handleSubmit}>
        <InputContainer>
          <Label>
            이름
            <Required>*</Required>
          </Label>
          <Input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={() => handleblur("name")}
            required
            placeholder="이름을 입력해주세요"
          />
          {errorMsg.name && <ErrorText>{errorMsg.name}</ErrorText>}
        </InputContainer>

        <InputContainer>
          <Label>
            아이디
            <Required>*</Required>
          </Label>
          <Input
            type="text"
            name="loginId"
            value={form.loginId}
            onChange={handleChange}
            onBlur={() => handleblur("loginId")}
            required
            placeholder="영문, 숫자 포함 4~20자"
          />
          {errorMsg.loginId && <ErrorText>{errorMsg.loginId}</ErrorText>}
        </InputContainer>

        <InputContainer>
          <Label>
            비밀번호
            <Required>*</Required>
          </Label>
          <Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            onBlur={() => handleblur("password")}
            required
            placeholder="영문, 숫자, 특수문자 포함 8~16자"
          />
          {errorMsg.password && <ErrorText>{errorMsg.password}</ErrorText>}
        </InputContainer>

        <InputContainer>
          <Label>
            비밀번호 확인
            <Required>*</Required>
          </Label>
          <Input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            onBlur={() => handleblur("confirmPassword")}
            required
            placeholder="비밀번호 다시 입력"
          />
          {errorMsg.confirmPassword && <ErrorText>{errorMsg.confirmPassword}</ErrorText>}
        </InputContainer>

        <InputContainer>
          <Label>
            이메일
            <Required>*</Required>
          </Label>
          <InputWrapper>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={() => handleblur("email")}
              required
              style={{flex: 1}}
              placeholder="example@email.com"
            />

            <Button
              type="button"
              onClick={() => emailMutation.mutate()}
              disabled={!form.email || emailMutation.isPending || isVerified || !!errorMsg.email}
              style={{ flexShrink: 0, padding: "8px 12px", fontSize: "0.9rem"}}
            >
              {emailMutation.isPending
              ? "전송 중..."
              : isVerified
              ? "인증 완료"
              : "인증"}
            </Button>
          </InputWrapper>
          {errorMsg.email && <ErrorText>{errorMsg.email}</ErrorText>}
          {step === "VERIFIED" && (<span style={{color: "green", marginTop: "4px"}}>이메일 인증 완료</span>)}
        </InputContainer>

        <InputContainer>
          <Label>휴대폰 번호</Label>
          <Input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            onBlur={() => handleblur("phone")}
            placeholder="- 제외한 휴대폰 번호"
          />
          {errorMsg.phone && <ErrorText>{errorMsg.phone}</ErrorText>}
        </InputContainer>

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

const InputWrapper = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
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

const Label = styled.label``;

const Required = styled.span`
  color: #eb2222;
  margin-left: 4px;
`;

const ErrorText = styled.p`
  color: #eb2222;
  font-size: 0.9rem;
`;

const Button = styled.button`
  padding: 12px;
  background: #1b73e8;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  transition: 0.3s background ease;

  &:hover {
    background-color: #0b5ac2;
  }

  &:disabled {
    background: #bbb;
    cursor: not-allowed;
    color: #666;
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
