import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/api';

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { 
    username: string; 
    email: string; 
    password: string; 
    confirmPassword: string 
  }) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次密码输入不一致');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({
        username: values.username,
        email: values.email,
        password: values.password
      });

      message.success('注册成功，请登录');
      // Store the token and user info
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/dashboard');
    } catch (error: any) {
      console.error('注册失败:', error);
      if (error.response?.data?.errors) {
        // 处理验证错误
        const validationErrors = error.response.data.errors;
        validationErrors.forEach((err: any) => {
          message.error(err.msg);
        });
      } else {
        message.error(error.response?.data?.error || '注册失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
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
        name="register"
        className="register-form"
        style={{
          width: 350,
          padding: 24,
          borderRadius: 8,
          backgroundColor: 'white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>注册新账号</h2>
        
        <Form.Item
          name="username"
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 3, message: '用户名至少3个字符' },
            { max: 20, message: '用户名最多20个字符' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' }
          ]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="用户名" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' }
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="邮箱" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少6个字符' },
            { pattern: /\d/, message: '密码必须包含数字' },
            { pattern: /[a-zA-Z]/, message: '密码必须包含字母' }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="密码" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: '请确认密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="确认密码" 
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            className="register-form-button" 
            style={{ width: '100%' }}
            loading={loading}
            size="large"
          >
            注册
          </Button>
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            已有账号？ <a onClick={() => navigate('/login')}>立即登录</a>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
