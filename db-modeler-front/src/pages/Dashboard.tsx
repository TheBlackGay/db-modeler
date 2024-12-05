import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Menu, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message,
  Pagination,
  Spin,
  Empty
} from 'antd';
import { 
  DatabaseOutlined, 
  TableOutlined, 
  UserOutlined, 
  PlusOutlined 
} from '@ant-design/icons';
import { useRecoilState, useRecoilValue } from 'recoil';
import { databaseService } from '@/services/api';
import { databaseState, userState } from '@/store';
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

interface DatabaseFormValues {
  name: string;
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  description?: string;
}

const Dashboard: React.FC = () => {
  const [databaseModal, setDatabaseModal] = useState(false);
  const [databases, setDatabases] = useRecoilState(databaseState);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const user = useRecoilValue(userState);

  // 分页和搜索状态
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [type, setType] = useState<string | undefined>();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchDatabases();
  }, [page, pageSize, search, type]);

  const fetchDatabases = async () => {
    try {
      setLoading(true);
      const response = await databaseService.listDatabases({
        page,
        pageSize,
        search,
        type
      });
      
      setDatabases(prev => ({
        ...prev,
        items: response.data.map(db => ({
          id: db.id,
          name: db.name || '未命名数据库',
          type: db.type || 'unknown',
          description: db.description,
          host: db.host || 'localhost',
          port: db.port || 3306,
          status: db.status || 'unknown',
          lastSync: db.lastSync,
          createdAt: db.createdAt,
          updatedAt: db.updatedAt
        })),
        total: response.total || 0,
        error: null
      }));
    } catch (error) {
      console.error('获取数据库列表失败:', error);
      message.error(error.message || '获取数据库列表失败');
      setDatabases(prev => ({
        ...prev,
        items: [],
        total: 0,
        error: error.message
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDatabase = async (values: DatabaseFormValues) => {
    setLoading(true);
    try {
      const newDatabase = await databaseService.createDatabase(values);
      setDatabases(prev => ({
        ...prev,
        items: prev?.items ? [...prev.items, newDatabase] : [newDatabase],
        total: (prev?.total || 0) + 1,
        error: null
      }));
      setDatabaseModal(false);
      form.resetFields();
      message.success('数据库创建成功');
    } catch (error) {
      console.error('创建数据库失败:', error);
      message.error('创建数据库失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDatabaseSelect = (databaseId: string) => {
    const selected = databases.items.find(db => db.id === databaseId);
    if (selected) {
      setDatabases(prev => ({
        ...prev,
        selectedDatabase: selected
      }));
      navigate(`/database/${databaseId}`);
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleTypeChange = (value: string | undefined) => {
    setType(value);
    setPage(1);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="1" icon={<DatabaseOutlined />}>
            数据库管理
          </Menu.Item>
          <Menu.Item key="2" icon={<TableOutlined />}>
            表结构管理
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            用户管理
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>数据库管理</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setDatabaseModal(true)}>
            添加数据库
          </Button>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          {/* 搜索和筛选表单 */}
          <Form layout="inline" style={{ marginBottom: 16 }}>
            <Form.Item label="搜索">
              <Input.Search
                placeholder="搜索数据库名称"
                onSearch={handleSearch}
                style={{ width: 200 }}
                allowClear
              />
            </Form.Item>
            <Form.Item label="类型">
              <Select
                style={{ width: 150 }}
                placeholder="选择数据库类型"
                onChange={handleTypeChange}
                allowClear
              >
                <Option value="mysql">MySQL</Option>
                <Option value="postgresql">PostgreSQL</Option>
                <Option value="mongodb">MongoDB</Option>
                <Option value="oracle">Oracle</Option>
                <Option value="mssql">SQL Server</Option>
              </Select>
            </Form.Item>
          </Form>

          {/* 数据库列表 */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <Spin size="large" />
            </div>
          ) : databases?.error ? (
            <div style={{ textAlign: 'center', padding: '50px 0', color: '#ff4d4f' }}>
              {databases.error}
            </div>
          ) : !databases?.items?.length ? (
            <Empty description="暂无数据库" />
          ) : (
            <Row gutter={[16, 16]}>
              {(databases.items || []).map((db: any) => (
                <Col key={db?.id || Math.random()} span={8}>
                  <Card
                    hoverable
                    onClick={() => handleDatabaseSelect(db?.id)}
                  >
                    <Card.Meta
                      avatar={<DatabaseOutlined style={{ fontSize: 24 }} />}
                      title={db?.name || 'Unnamed Database'}
                      description={
                        <>
                          <p>{db?.description || '暂无描述'}</p>
                          <p>类型: {(db?.type || 'unknown')?.toUpperCase()}</p>
                          <p>状态: {db?.status || '未知'}</p>
                          <p>最后同步: {db?.lastSync || '从未同步'}</p>
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* 分页 */}
          {!loading && !databases?.error && databases.items?.length > 0 && (
            <Row justify="end" style={{ marginTop: 16 }}>
              <Col>
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={total}
                  onChange={handlePageChange}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total) => `共 ${total} 条记录`}
                />
              </Col>
            </Row>
          )}
        </Content>
      </Layout>

      {/* 创建数据库的模态框 */}
      <Modal
        title="添加数据库"
        visible={databaseModal}
        onCancel={() => {
          setDatabaseModal(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateDatabase}
        >
          <Form.Item
            name="name"
            label="数据库名称"
            rules={[{ required: true, message: '请输入数据库名称' }]}
          >
            <Input placeholder="请输入数据库名称" />
          </Form.Item>
          <Form.Item
            name="type"
            label="数据库类型"
            rules={[{ required: true, message: '请选择数据库类型' }]}
          >
            <Select placeholder="请选择数据库类型">
              <Option value="mysql">MySQL</Option>
              <Option value="postgresql">PostgreSQL</Option>
              <Option value="mongodb">MongoDB</Option>
              <Option value="oracle">Oracle</Option>
              <Option value="mssql">SQL Server</Option>
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
            label="端口号"
            rules={[{ required: true, message: '请输入端口号' }]}
          >
            <Input type="number" placeholder="请输入端口号" />
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
          <Form.Item name="description" label="描述">
            <Input.TextArea placeholder="请输入数据库描述" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" loading={loading} block>
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Dashboard;
