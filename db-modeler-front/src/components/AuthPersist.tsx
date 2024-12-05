import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { userState } from '@/store';
import { getToken, removeToken } from '@/utils/auth';
import { authService } from '@/services/api';
import { Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthPersist: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const setUserState = useSetRecoilState(userState);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await authService.profile();
          if (response?.user) {
            setUserState({
              isAuthenticated: true,
              user: response.user,
              token
            });
          } else {
            throw new Error('Invalid user data');
          }
        } catch (error) {
          console.error('Failed to restore auth state:', error);
          removeToken();
          setUserState({
            isAuthenticated: false,
            user: null,
            token: null
          });
          
          // 只有在非登录页面时才重定向
          if (location.pathname !== '/login') {
            navigate('/login', { replace: true });
          }
        }
      } else {
        // 没有 token 且不在登录页面时重定向
        if (location.pathname !== '/login') {
          navigate('/login', { replace: true });
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [setUserState, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthPersist;
