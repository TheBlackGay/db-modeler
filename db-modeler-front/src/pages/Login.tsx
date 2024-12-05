import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { authService } from '@/services/api';
import { userState } from '@/store';

interface LoginFormValues {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUserState = useSetRecoilState(userState);

  const onFinish = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      const { token, user, message: loginMessage } = await authService.login(values.username, values.password);
      
      // 更新用户状态
      setUserState({
        isAuthenticated: true,
        user,
        token
      });

      message.success(loginMessage || '登录成功');
      navigate('/', { replace: true });
    } catch (error: any) {
      console.error('登录失败:', error);
      message.error(error.response?.data?.error || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <Form
        name="login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        style={{
          width: 350,
          padding: 30,
          background: 'white',
          borderRadius: 8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>DB Modeler</h2>
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input 
            prefix={<UserOutlined className="site-form-item-icon" />} 
            placeholder="用户名" 
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="密码"
          />
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            className="login-form-button" 
            loading={loading}
            block
          >
            登录
          </Button>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: 10 
          }}>
            <a onClick={() => navigate('/forgot-password')}>忘记密码</a>
            <a onClick={handleRegister}>立即注册</a>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
