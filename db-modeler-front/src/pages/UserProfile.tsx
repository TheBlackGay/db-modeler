import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Form, 
  Input, 
  Button, 
  Avatar, 
  Typography, 
  Row, 
  Col, 
  message, 
  Upload, 
  Space 
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
  CloudUploadOutlined 
} from '@ant-design/icons';
import { useRecoilState } from 'recoil';
import { userState } from '@/store';
import { authService } from '@/services/api';

const { Title, Text } = Typography;
const { Content } = Layout;

const UserProfile: React.FC = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [user, setUser] = useRecoilState(userState);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email
      });
    }
  }, [user, form]);

  const handleUpdateProfile = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append('username', values.username);
      formData.append('email', values.email);

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const updatedUser = await authService.updateProfile(formData);
      setUser(updatedUser);
      message.success('个人信息更新成功');
    } catch (error) {
      message.error('更新失败，请重试');
    }
  };

  const handleChangePassword = async (values: any) => {
    try {
      await authService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      message.success('密码修改成功');
      passwordForm.resetFields();
    } catch (error) {
      message.error('密码修改失败，请检查当前密码');
    }
  };

  const handleAvatarUpload = (info: any) => {
    const file = info.file.originFileObj;
    setAvatarFile(file);
  };

  return (
    <Layout>
      <Content style={{ padding: 24 }}>
        <Row gutter={24}>
          <Col span={8}>
            <Card>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center' 
              }}>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  onChange={handleAvatarUpload}
                  beforeUpload={() => false}
                >
                  {user?.avatar ? (
                    <Avatar 
                      size={128} 
                      src={user.avatar} 
                      icon={<UserOutlined />} 
                    />
                  ) : (
                    <div>
                      <CloudUploadOutlined />
                      <div style={{ marginTop: 8 }}>上传头像</div>
                    </div>
                  )}
                </Upload>
                <Title level={4} style={{ marginTop: 16 }}>
                  {user?.username}
                </Title>
                <Text type="secondary">{user?.email}</Text>
                <Text type="secondary">
                  角色：{user?.role || '普通用户'}
                </Text>
              </div>
            </Card>
          </Col>
          <Col span={16}>
            <Card title="个人信息" style={{ marginBottom: 16 }}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdateProfile}
              >
                <Form.Item
                  name="username"
                  label="用户名"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="用户名" 
                  />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="电子邮箱"
                  rules={[
                    { required: true, message: '请输入电子邮箱' },
                    { type: 'email', message: '请输入有效的电子邮箱' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder="电子邮箱" 
                  />
                </Form.Item>
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    block
                  >
                    更新个人信息
                  </Button>
                </Form.Item>
              </Form>
            </Card>
            <Card title="修改密码">
              <Form
                form={passwordForm}
                layout="vertical"
                onFinish={handleChangePassword}
              >
                <Form.Item
                  name="currentPassword"
                  label="当前密码"
                  rules={[{ required: true, message: '请输入当前密码' }]}
                >
                  <Input.Password 
                    prefix={<LockOutlined />} 
                    placeholder="当前密码" 
                  />
                </Form.Item>
                <Form.Item
                  name="newPassword"
                  label="新密码"
                  rules={[
                    { required: true, message: '请输入新密码' },
                    { min: 8, message: '密码至少8个字符' }
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined />} 
                    placeholder="新密码" 
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label="确认新密码"
                  dependencies={['newPassword']}
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
                  <Input.Password 
                    prefix={<LockOutlined />} 
                    placeholder="确认新密码" 
                  />
                </Form.Item>
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    block
                  >
                    修改密码
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default UserProfile;
