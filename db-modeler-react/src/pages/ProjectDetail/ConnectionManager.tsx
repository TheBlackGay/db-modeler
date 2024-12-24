import React, { useState } from 'react';
import { Modal, Form, Input, Button, Table, Space, message, Popconfirm, Select, InputNumber } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import type { Connection, TestRecord } from '../../types/models';
import { RootState } from '../../store';
import { addConnection, updateConnection, deleteConnection, testConnection } from '../../store/projectsSlice';

interface ConnectionManagerProps {
  visible: boolean;
  projectId: string;
  onCancel: () => void;
}

interface ConnectionFormValues {
  name: string;
  type: 'mysql' | 'postgresql' | 'oracle' | 'sqlserver';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export const ConnectionManager: React.FC<ConnectionManagerProps> = ({ visible, projectId, onCancel }) => {
  const [form] = Form.useForm<ConnectionFormValues>();
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  const dispatch = useDispatch();
  const connections = useSelector((state: RootState) => 
    state.projects.projects.find((p: { id: string }) => p.id === projectId)?.connections || []
  );

  const handleAdd = () => {
    setEditMode(false);
    setSelectedConnection(null);
    form.resetFields();
    form.setFieldsValue({
      type: 'mysql',
      port: 3306,
    });
  };

  const handleEdit = (connection: Connection) => {
    setEditMode(true);
    setSelectedConnection(connection);
    form.setFieldsValue({
      name: connection.name,
      type: connection.type,
      host: connection.host,
      port: connection.port,
      database: connection.database,
      username: connection.username,
      password: connection.password,
    });
  };

  const handleDelete = async (connectionId: string) => {
    try {
      await dispatch(deleteConnection({ projectId, connectionId }));
      message.success('删除连接成功');
    } catch (error) {
      message.error('删除连接失败：' + (error as Error).message);
    }
  };

  const handleSave = async (values: ConnectionFormValues) => {
    try {
      const now = new Date().toISOString();
      if (editMode && selectedConnection) {
        await dispatch(updateConnection({
          projectId,
          connectionId: selectedConnection.id,
          connection: {
            ...selectedConnection,
            ...values,
            updatedAt: now,
          },
        }));
        message.success('更新连接成功');
      } else {
        const newConnection: Connection = {
          id: Date.now().toString(),
          ...values,
          testHistory: [],
          createdAt: now,
          updatedAt: now,
        };
        await dispatch(addConnection({ projectId, connection: newConnection }));
        message.success('添加连接成功');
      }
      onCancel();
    } catch (error) {
      message.error('保存连接失败：' + (error as Error).message);
    }
  };

  const handleTest = async (connectionId: string) => {
    setTestingConnection(connectionId);
    const startTime = Date.now();
    try {
      const connection = connections.find((c: Connection) => c.id === connectionId);
      if (!connection) {
        throw new Error('找不到指定的连接');
      }

      await dispatch(testConnection({ projectId, connectionId }));
      const responseTime = Date.now() - startTime;

      const testRecord: TestRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        status: 'success',
        responseTime,
        serverInfo: {
          version: '8.0.26',
          platform: 'x86_64-Linux',
          charset: 'utf8mb4',
        },
      };

      await dispatch(updateConnection({
        projectId,
        connectionId,
        connection: {
          ...connection,
          testHistory: [...(connection.testHistory || []), testRecord],
          updatedAt: new Date().toISOString(),
        },
      }));

      message.success('连接测试成功');
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const connection = connections.find((c: Connection) => c.id === connectionId);
      if (connection) {
        const testRecord: TestRecord = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          status: 'failure',
          responseTime,
          error: (error as Error).message,
        };

        await dispatch(updateConnection({
          projectId,
          connectionId,
          connection: {
            ...connection,
            testHistory: [...(connection.testHistory || []), testRecord],
            updatedAt: new Date().toISOString(),
          },
        }));
      }
      message.error('连接测试失败：' + (error as Error).message);
    } finally {
      setTestingConnection(null);
    }
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
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
      render: (_: unknown, record: Connection) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleTest(record.id)}
            loading={testingConnection === record.id}
          >
            测试
          </Button>
          <Button onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm
            title="确定要删除这个连接吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title={editMode ? '编辑连接' : '新建连接'}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{
          type: 'mysql',
          port: 3306,
        }}
      >
        <Form.Item
          name="name"
          label="连接名称"
          rules={[{ required: true, message: '请输入连接名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label="数据库类型"
          rules={[{ required: true, message: '请选择数据库类型' }]}
        >
          <Select>
            <Select.Option value="mysql">MySQL</Select.Option>
            <Select.Option value="postgresql">PostgreSQL</Select.Option>
            <Select.Option value="oracle">Oracle</Select.Option>
            <Select.Option value="sqlserver">SQL Server</Select.Option>
          </Select>
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
          <InputNumber min={1} max={65535} />
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
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
            <Button onClick={onCancel}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={connections}
        rowKey="id"
        pagination={false}
      />
    </Modal>
  );
}; 