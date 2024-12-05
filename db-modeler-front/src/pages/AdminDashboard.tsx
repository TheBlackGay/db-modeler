import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Tag,
  Space
} from 'antd';
import { 
  UserOutlined, 
  DatabaseOutlined, 
  TeamOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import { adminService } from '@/services/api';

const { Content } = Layout;
const { Option } = Select;

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [userModal, setUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form] = Form.useForm();
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalDatabases: 0,
    totalTableSchemas: 0
  });

  useEffect(() => {
    fetchStatistics();
    fetchUsers();
  }, []);

  const fetchStatistics = async () => {
    try {
      const data = await adminService.getStatistics();
      setStatistics(data);
    } catch (error) {
      message.error('获取统计信息失败');
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await adminService.listUsers();
      setUsers(data);
    } catch (error) {
      message.error('获取用户列表失败');
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    form.resetFields();
    setUserModal(true);
  };

  const handleEditUser = (record: any) => {
    setEditingUser(record);
    form.setFieldsValue({
      username: record.username,
      email: record.email,
      role: record.role
    });
    setUserModal(true);
  };

  const handleDeleteUser = async (record: any) => {
    try {
      await adminService.deleteUser(record.id);
      message.success('删除用户成功');
      fetchUsers();
    } catch (error) {
      message.error('删除用户失败');
    }
  };

  const handleUserSubmit = async (values: any) => {
    try {
      if (editingUser) {
        await adminService.updateUser(editingUser.id, values);
      } else {
        await adminService.createUser(values);
      }
      message.success(editingUser ? '更新用户成功' : '创建用户成功');
      setUserModal(false);
      fetchUsers();
    } catch (error) {
      message.error(editingUser ? '更新用户失败' : '创建用户失败');
    }
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: '电子邮箱',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const roleColors = {
          admin: 'red',
          editor: 'blue',
          viewer: 'green',
          user: 'default'
        };
        return <Tag color={roleColors[role as keyof typeof roleColors]}>{role}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEditUser(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteUser(record)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <Layout>
      <Content style={{ padding: 24 }}>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="总用户数"
                value={statistics.totalUsers}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="数据库总数"
                value={statistics.totalDatabases}
                prefix={<DatabaseOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="表结构总数"
                value={statistics.totalTableSchemas}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card 
          title="用户管理"
          extra={
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleCreateUser}
            >
              创建用户
            </Button>
          }
        >
          <Table 
            columns={columns} 
            dataSource={users} 
            rowKey="id"
          />
        </Card>

        <Modal
          title={editingUser ? '编辑用户' : '创建用户'}
          open={userModal}
          onCancel={() => setUserModal(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUserSubmit}
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="email"
              label="电子邮箱"
              rules={[
                { required: true, message: '请输入电子邮箱' },
                { type: 'email', message: '请输入有效的电子邮箱' }
              ]}
            >
              <Input placeholder="请输入电子邮箱" />
            </Form.Item>
            <Form.Item
              name="role"
              label="用户角色"
              rules={[{ required: true, message: '请选择用户角色' }]}
            >
              <Select placeholder="选择用户角色">
                <Option value="admin">管理员</Option>
                <Option value="editor">编辑者</Option>
                <Option value="viewer">浏览者</Option>
                <Option value="user">普通用户</Option>
              </Select>
            </Form.Item>
            {!editingUser && (
              <Form.Item
                name="password"
                label="初始密码"
                rules={[
                  { required: true, message: '请输入初始密码' },
                  { min: 8, message: '密码至少8个字符' }
                ]}
              >
                <Input.Password placeholder="请输入初始密码" />
              </Form.Item>
            )}
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block
              >
                {editingUser ? '更新' : '创建'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;
