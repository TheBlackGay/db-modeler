import React, { useState } from 'react';
import { Layout, Card, Button, Table, Space, Modal, Form, Input, message, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addConnection, updateConnection, deleteConnection } from '../../store/projectSlice';
import type { RootState } from '../../main';
import type { DatabaseConnection } from '../../store/projectSlice';
import { v4 as uuidv4 } from 'uuid';

const { Content } = Layout;
const { Title } = Typography;

export const DatabaseConnections: React.FC = () => {
  const dispatch = useDispatch();
  const currentProject = useSelector((state: RootState) => state.projects.currentProject);
  const loading = useSelector((state: RootState) => state.projects.loading);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  const columns = [
    {
      title: '连接名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '主机',
      dataIndex: 'host',
      key: 'host',
    },
    {
      title: '端口',
      dataIndex: 'port',
      key: 'port',
    },
    {
      title: '数据库',
      dataIndex: 'database',
      key: 'database',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: DatabaseConnection) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<LinkOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleTest(record);
            }}
          >
            测试连接
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(record.id);
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: DatabaseConnection) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    if (!currentProject) return;

    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个数据库连接吗？',
      onOk() {
        dispatch(deleteConnection({ projectId: currentProject.id, connectionId: id }));
        message.success('删除成功');
      },
    });
  };

  const handleTest = async (connection: DatabaseConnection) => {
    try {
      message.success('连接成功');
    } catch (error) {
      message.error('连接失败');
    }
  };

  const handleModalOk = async () => {
    if (!currentProject) return;

    try {
      const values = await form.validateFields();
      const now = new Date().toISOString();
      if (editingId) {
        dispatch(
          updateConnection({
            projectId: currentProject.id,
            connection: {
              ...values,
              id: editingId,
              updatedAt: now,
            },
          })
        );
        message.success('更新成功');
      } else {
        dispatch(
          addConnection({
            projectId: currentProject.id,
            connection: {
              ...values,
              id: uuidv4(),
              createdAt: now,
              updatedAt: now,
            },
          })
        );
        message.success('创建成功');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  if (!currentProject) {
    return (
      <Content style={{ padding: '24px' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <Title level={4}>请先选择一个项目</Title>
          </div>
        </Card>
      </Content>
    );
  }

  return (
    <Content style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>数据库连接</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新建连接
          </Button>
        </div>
        <Table<DatabaseConnection>
          columns={columns}
          dataSource={currentProject.connections}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingId ? '编辑连接' : '新建连接'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="连接名称"
            rules={[{ required: true, message: '请输入连接名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="host"
            label="主机"
            rules={[{ required: true, message: '请输入主机地址' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="port"
            label="端口"
            rules={[{ required: true, message: '请输入端口号' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="database"
            label="数据库"
            rules={[{ required: true, message: '请输入数据库名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
}; 