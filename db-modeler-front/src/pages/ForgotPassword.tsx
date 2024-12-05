import React, { useState } from 'react';
import { Form, Input, Button, message, Steps } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/api';

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSendVerificationCode = async (values: { email: string }) => {
    setLoading(true);
    try {
      await authService.sendPasswordResetCode(values.email);
      setEmail(values.email);
      setCurrentStep(1);
      message.success('验证码已发送，请检查您的邮箱');
    } catch (error: any) {
      message.error(error.response?.data?.error || '发送验证码失败');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: { verificationCode: string; newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次密码输入不一致');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        email,
        verificationCode: values.verificationCode,
        newPassword: values.newPassword
      });
      message.success('密码重置成功');
      navigate('/login');
    } catch (error: any) {
      message.error(error.response?.data?.error || '密码重置失败');
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
        name="forgot-password"
        className="forgot-password-form"
        initialValues={{ remember: true }}
        style={{
          width: 400,
          padding: 30,
          background: 'white',
          borderRadius: 8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>重置密码</h2>
        
        <Steps current={currentStep} style={{ marginBottom: 20 }}>
          <Steps.Step title="验证邮箱" />
          <Steps.Step title="重置密码" />
        </Steps>

        {currentStep === 0 && (
          <Form
            onFinish={handleSendVerificationCode}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input 
                prefix={<MailOutlined className="site-form-item-icon" />} 
                placeholder="请输入注册邮箱" 
              />
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="verification-code-button" 
                loading={loading}
                block
              >
                发送验证码
              </Button>
            </Form.Item>
          </Form>
        )}

        {currentStep === 1 && (
          <Form
            onFinish={handleResetPassword}
          >
            <Form.Item
              name="verificationCode"
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <Input 
                prefix={<LockOutlined className="site-form-item-icon" />} 
                placeholder="请输入验证码" 
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, message: '密码至少6个字符' }
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="新密码"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              rules={[
                { required: true, message: '请确认新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次密码输入不一致'));
                  },
                }),
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="确认新密码"
              />
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="reset-password-button" 
                loading={loading}
                block
              >
                重置密码
              </Button>
            </Form.Item>
          </Form>
        )}

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: 10 
        }}>
          <a onClick={() => navigate('/login')}>返回登录</a>
        </div>
      </Form>
    </div>
  );
};

export default ForgotPassword;
