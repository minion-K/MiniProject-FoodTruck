import { authApi } from "@/apis/auth/auth.api";
import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

function EmailVerifyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [msg, setMsg] = useState<string>("이메일 인증 중입니다...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setErrorMsg("유효하지 않은 요청입니다.");

      return;
    }

    authApi
      .verifyEmail(token)
      .then(() => {
        setMsg("이메일 인증이 완료되었습니다. 회원가입을 완료해주세요.");
        navigate("/register?verified=true");
      })
      .catch((err) => {
        setErrorMsg(
          "이메일 인증에 실패했습니다. 링크가 만료되었거나 잘못되었습니다."
        );
      });
  }, [searchParams]);

  return (
    <Container>
      <Box>
        {msg && <Msg>{msg}</Msg>}
        {errorMsg && <Error>{errorMsg}</Error>}
      </Box>
    </Container>
  );
}

export default EmailVerifyPage;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f6f8;
`;

const Box = styled.div`
  padding: 40px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Msg = styled.p`
  font-size: 1.2rem;
  color: #1b73e8;
`;

const Error = styled.p`
  font-size: 1.2rem;
  color: #eb2222;
`;
