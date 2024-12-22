import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Card, Input, Button, Select, Space, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined, SyncOutlined, SendOutlined } from '@ant-design/icons';
import { InterfaceInfo, InterfaceStatus, HttpMethod } from '../types';

const { Option } = Select;
const { Title } = Typography;

/**
 * 接口列表页面
 */
const InterfaceList: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<InterfaceStatus | ''>('');
  const [loading, setLoading] = useState(false);

  // 表格列配置
  const columns: ColumnsType<InterfaceInfo> = [
    {
      title: '接口名称',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: (text: string, record: InterfaceInfo) => (
        <a onClick={() => navigate(`/interface/detail/${record.id}`)}>
          <Typography.Text ellipsis={{ tooltip: text }}>
            {text}
          </Typography.Text>
        </a>
      ),
    },
    {
      title: '请求路径',
      dataIndex: 'path',
      key: 'path',
      width: '25%',
      ellipsis: true,
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      key: 'method',
      width: '10%',
      align: 'center',
      render: (method: HttpMethod) => (
        <Tag color={method === HttpMethod.GET ? 'green' : method === HttpMethod.POST ? 'blue' : method === HttpMethod.PUT ? 'orange' : method === HttpMethod.DELETE ? 'red' : 'default'}>
          {method}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      align: 'center',
      render: (status: InterfaceStatus) => {
        const statusConfig = {
          [InterfaceStatus.ONLINE]: { color: 'success', text: '已上线' },
          [InterfaceStatus.OFFLINE]: { color: 'default', text: '已下线' },
          [InterfaceStatus.TESTING]: { color: 'processing', text: '测试中' },
          [InterfaceStatus.DRAFT]: { color: 'warning', text: '草稿' },
        };
        return (
          <Tag color={statusConfig[status].color}>
            {statusConfig[status].text}
          </Tag>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: '15%',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      width: '20%',
      align: 'center',
      render: (_, record: InterfaceInfo) => (
        <Space size="middle">
          <Button type="link" size="small" onClick={() => navigate(`/interface/detail/${record.id}`)}>
            详情
          </Button>
          <Button type="link" size="small" onClick={() => navigate(`/interface/edit/${record.id}`)}>
            编辑
          </Button>
          <Button type="link" size="small" onClick={() => navigate(`/interface/debug/${record.id}`)}>
            调试
          </Button>
          <Button type="link" size="small" onClick={() => navigate(`/interface/monitor/${record.id}`)}>
            监控
          </Button>
        </Space>
      ),
    },
  ];

  // 模拟数据
  const mockData: InterfaceInfo[] = [
    {
      id: '1',
      name: '获取用户信息',
      path: '/api/user/info',
      method: HttpMethod.GET,
      status: InterfaceStatus.ONLINE,
      description: '获取当前登录用户的详细信息',
      creator: 'admin',
      createTime: '2024-01-20 10:00:00',
      updateTime: '2024-01-20 10:00:00',
      requestParams: [],
      responseParams: [],
    },
    {
      id: '2',
      name: '创建订单',
      path: '/api/order/create',
      method: HttpMethod.POST,
      status: InterfaceStatus.TESTING,
      description: '创建新订单',
      creator: 'admin',
      createTime: '2024-01-20 11:00:00',
      updateTime: '2024-01-20 11:00:00',
      requestParams: [],
      responseParams: [],
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    // 模拟刷新
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space style={{ float: 'right' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/interface/edit')}
            >
              新建接口
            </Button>
            <Button
              icon={<SyncOutlined spin={loading} />}
              onClick={handleRefresh}
            >
              刷新
            </Button>
          </Space>
          <Space>
            <Input.Search
              placeholder="搜索接口名称"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Select
              placeholder="接口状态"
              style={{ width: 120 }}
              allowClear
              value={statusFilter}
              onChange={value => setStatusFilter(value)}
            >
              {Object.values(InterfaceStatus).map(status => (
                <Option key={status} value={status}>
                  {status === InterfaceStatus.ONLINE ? '已上线' :
                    status === InterfaceStatus.OFFLINE ? '已下线' :
                    status === InterfaceStatus.TESTING ? '测试中' :
                    '草稿'}
                </Option>
              ))}
            </Select>
          </Space>
        </div>
        <Table<InterfaceInfo>
          columns={columns}
          dataSource={mockData}
          rowKey="id"
          loading={loading}
          pagination={{
            total: mockData.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );
};

export default InterfaceList; 