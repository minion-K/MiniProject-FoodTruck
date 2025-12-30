import { userApi } from '@/apis/user/user.api';
import { useAuthStore } from '@/stores/auth.store';
import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function OAuth2CallbackPage() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const setAccessToken = useAuthStore(state => state.setAccessToken);
  const setUser = useAuthStore(state => state.setUser);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const accessToken = searchParams.get("accessToken");

      if(!accessToken) {
        navigate("/login?error=oauth2");
        
        return;
      }

      try {
        setAccessToken(accessToken);

        const data = await userApi.me();
        if(!data) {
          navigate("/login?error=oauth2_me");

          return;
        }
        setUser(data);
        
        const role = data.roles ?? [];
        
        if(role.includes("ADMIN")) {
          navigate("/admin", {replace: true});
        } else if(role.includes("OWNER")) {
          navigate("/owner", {replace: true});
        } else {
          navigate("/", {replace: true});
        }
      } catch(err) {
        navigate("/login?error=oauth2_me");
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
