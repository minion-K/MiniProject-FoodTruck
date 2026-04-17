import { userApi } from '@/apis/user/user.api';
import { useAuthStore } from '@/stores/auth.store';
import { getErrorMsg } from '@/utils/error';
import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function OAuth2CallbackPage() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const setAccessToken = useAuthStore(state => state.setAccessToken);
  const setUser = useAuthStore(state => state.setUser);
  const setShowAlert = useAuthStore(state => state.setShowAlert);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const accessToken = searchParams.get("accessToken");

      if(!accessToken) {
        navigate("/login?error=oauth2");
        
        return;
      }

      try {
        setAccessToken(accessToken);

        const res = await userApi.me();
        if(!res) {
          navigate("/login?error=oauth2_me");

          return;
        }
        setUser(res);

        if(res.status !== "ACTIVE") {
          setShowAlert(true);
        }
        
        navigate("/", {replace: true});
      } catch (e) {
        alert(getErrorMsg(e));
      }
    }

    handleOAuthCallback();
  }, [searchParams, navigate, setAccessToken, setUser])

  return (
    <div>
      소셜 로그인 처리 중입니다.
    </div>
  )
}

export default OAuth2CallbackPage
