import React, { useState } from 'react';
import { Button, Table, Space, Modal, Form, Input, Select, message, Card, Empty, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateProject } from '../../store/projectsSlice';
import type { IProject, IConnection } from '../../data/mockData';
import { v4 as uuidv4 } from 'uuid';

const { Option } = Select;

// 数据库类型选项
const databaseTypes = [
  { label: 'MySQL', value: 'mysql', defaultPort: 3306 },
  { label: 'PostgreSQL', value: 'postgresql', defaultPort: 5432 },
  { label: 'SQL Server', value: 'sqlserver', defaultPort: 1433 },
  { label: 'Oracle', value: 'oracle', defaultPort: 1521 },
];

const DatabaseConnections: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch();
  const project = useSelector((state: RootState) => 
    state.projects.items.find(p => p.id === projectId)
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingConnection, setEditingConnection] = useState<IConnection | null>(null);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [form] = Form.useForm();

  // 如果project为空，显示提示信息
  if (!project) {
    return (
      <Card>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="未找到项目信息"
        />
      </Card>
    );
  }

  // 表格列定义
  const columns = [
    {
      title: '连接名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: IConnection, b: IConnection) => a.name.localeCompare(b.name),
    },
    {
      title: '数据库类型',
      dataIndex: 'type',
      key: 'type',
      filters: databaseTypes.map(type => ({ text: type.label, value: type.value })),
      onFilter: (value: string, record: IConnection) => record.type === value,
      render: (type: string) => databaseTypes.find(t => t.value === type)?.label || type,
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
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: (a: IConnection, b: IConnection) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: IConnection) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<LinkOutlined />}
            loading={testingConnection === record.id}
            onClick={() => handleTest(record)}
          >
            测试连接
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 处理添加/编辑连接
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        const now = new Date().toISOString().split('T')[0];
        const updatedProject = { ...project };

        if (editingConnection) {
          // 编辑现有连接
          updatedProject.connections = project.connections.map(c => 
            c.id === editingConnection.id 
              ? { ...c, ...values, updatedAt: now }
              : c
          );
          message.success('连接编辑成功');
        } else {
          // 创建新连接
          const newConnection: IConnection = {
            id: uuidv4(),
            ...values,
            createdAt: now,
            updatedAt: now,
          };
          updatedProject.connections = [...project.connections, newConnection];
          message.success('连接创建成功');
        }

        updatedProject.updatedAt = now;
        dispatch(updateProject(updatedProject));
        
        setIsModalVisible(false);
        form.resetFields();
        setEditingConnection(null);
      });
  };

  // 处理编辑
  const handleEdit = (connection: IConnection) => {
    setEditingConnection(connection);
    form.setFieldsValue(connection);
    setIsModalVisible(true);
  };

  // 处理删除
  const handleDelete = (connection: IConnection) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除连接 "${connection.name}" 吗？`,
      onOk() {
        const updatedProject = {
          ...project,
          connections: project.connections.filter(c => c.id !== connection.id),
          updatedAt: new Date().toISOString().split('T')[0]
        };
        dispatch(updateProject(updatedProject));
        message.success('删除成功');
      },
    });
  };

  // 处理测试连接
  const handleTest = async (connection: IConnection) => {
    setTestingConnection(connection.id);
    message.loading({ content: '正在测试连接...', key: 'testConnection' });

    try {
      // 模拟连接测试
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 随机成功或失败
          if (Math.random() > 0.3) {
            resolve(true);
          } else {
            reject(new Error('连接失败'));
          }
        }, 1500);
      });

      message.success({
        content: '连接测试成功',
        key: 'testConnection',
        duration: 2
      });
    } catch (error) {
      message.error({
        content: `连接测试失败: ${error instanceof Error ? error.message : '未知错误'}`,
        key: 'testConnection',
        duration: 3
      });
    } finally {
      setTestingConnection(null);
    }
  };

  // 处理数据库类型变化
  const handleTypeChange = (value: string) => {
    const defaultPort = databaseTypes.find(t => t.value === value)?.defaultPort;
    form.setFieldValue('port', defaultPort);
  };

  return (
    <div className="p-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold m-0">数据库连接管理</h2>
            <p className="text-gray-500 mt-2 mb-0">
              管理项目的数据库连接配置
            </p>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingConnection(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            新建连接
          </Button>
        </div>

        {(!project.connections || project.connections.length === 0) ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Space direction="vertical" align="center">
                <span>暂无数据库连接</span>
                <span className="text-gray-400">点击下方按钮添加第一个连接</span>
              </Space>
            }
          >
            <Button 
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingConnection(null);
                form.resetFields();
                setIsModalVisible(true);
              }}
            >
              立即创建
            </Button>
          </Empty>
        ) : (
          <Table 
            columns={columns} 
            dataSource={project.connections}
            rowKey="id"
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
          />
        )}
      </Card>

      <Modal
        title={`${editingConnection ? '编辑' : '新建'}数据库连接`}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingConnection(null);
        }}
        width={600}
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
            <Input placeholder="请输入连接名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="数据库类型"
            rules={[{ required: true, message: '请选择数据库类型' }]}
          >
            <Select 
              placeholder="请选择数据库类型"
              onChange={handleTypeChange}
            >
              {databaseTypes.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="host"
            label="主机地址"
            rules={[{ required: true, message: '请输入主机地址' }]}
          >
            <Input placeholder="请输入主机地址" />
          </Form.Item>

          <Form.Item
            name="port"
            label="端口"
            rules={[{ required: true, message: '请输入端口号' }]}
          >
            <Input type="number" placeholder="请输入端口号" />
          </Form.Item>

          <Form.Item
            name="database"
            label="数据库名"
            rules={[{ required: true, message: '请输入数据库名' }]}
          >
            <Input placeholder="请输入数据库名" />
          </Form.Item>

          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DatabaseConnections; 