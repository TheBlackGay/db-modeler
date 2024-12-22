import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Space, Tag, Table, Divider, Typography, Tabs, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, LineChartOutlined, CopyOutlined, ArrowLeftOutlined, SendOutlined } from '@ant-design/icons';
import { InterfaceInfo, InterfaceStatus, HttpMethod, ParamInfo, ParamType, ParamPosition } from '../types';

const { Text } = Typography;
const { TabPane } = Tabs;

const InterfaceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1');

  // 模拟数据
  const mockData: InterfaceInfo = {
    id: '1',
    name: '获取用户信息',
    path: '/api/user/info',
    method: HttpMethod.GET,
    status: InterfaceStatus.ONLINE,
    description: '获取当前登录用户的详细信息',
    creator: 'admin',
    createTime: '2024-01-20 10:00:00',
    updateTime: '2024-01-20 10:00:00',
    requestParams: [
      {
        id: '1',
        name: 'userId',
        type: ParamType.STRING,
        required: true,
        description: '用户ID',
        position: ParamPosition.QUERY,
      },
    ],
    responseParams: [
      {
        id: '1',
        name: 'username',
        type: ParamType.STRING,
        required: true,
        description: '用户名',
      },
      {
        id: '2',
        name: 'email',
        type: ParamType.STRING,
        required: true,
        description: '邮箱',
      },
    ],
  };

  // 参数表格列配置
  const paramColumns: ColumnsType<ParamInfo> = [
    {
      title: '参数名',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: '15%',
      render: (type: ParamType) => (
        <Tag color="blue">{type}</Tag>
      ),
    },
    {
      title: '是否必填',
      dataIndex: 'required',
      key: 'required',
      width: '10%',
      align: 'center',
      render: (required: boolean) => (
        <Tag color={required ? 'red' : 'default'}>
          {required ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '参数位置',
      dataIndex: 'position',
      key: 'position',
      width: '15%',
      render: (position?: ParamPosition) => 
        position ? <Tag color="purple">{position}</Tag> : '-',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '45%',
    },
  ];

  const handleCopyPath = () => {
    navigator.clipboard.writeText(mockData.path)
      .then(() => message.success('路径已复制到剪贴板'))
      .catch(() => message.error('复制失败'));
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/interface/list')}
            >
              返回
            </Button>
            <Text strong>{mockData.name}</Text>
          </Space>
        }
        extra={
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => navigate(`/interface/edit/${id}`)}
            >
              编辑
            </Button>
            <Button
              icon={<SendOutlined />}
              onClick={() => navigate(`/interface/debug/${id}`)}
            >
              调试
            </Button>
            <Button
              type="primary"
              icon={<LineChartOutlined />}
              onClick={() => navigate(`/interface/monitor/${id}`)}
            >
              监控
            </Button>
          </Space>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="基本信息" key="1">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="接口名称" span={2}>
                {mockData.name}
              </Descriptions.Item>
              <Descriptions.Item label="请求路径" span={2}>
                <Space>
                  <Text code copyable>{mockData.path}</Text>
                  <Button
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={handleCopyPath}
                  >
                    复制
                  </Button>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="请求方法">
                <Tag color={mockData.method === HttpMethod.GET ? 'green' : 'blue'}>
                  {mockData.method}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={mockData.status === InterfaceStatus.ONLINE ? 'success' : 'default'}>
                  {mockData.status === InterfaceStatus.ONLINE ? '已上线' :
                    mockData.status === InterfaceStatus.OFFLINE ? '已下线' :
                    mockData.status === InterfaceStatus.TESTING ? '测试中' :
                    '草稿'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="创建人">{mockData.creator}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{mockData.createTime}</Descriptions.Item>
              <Descriptions.Item label="更新时间" span={2}>{mockData.updateTime}</Descriptions.Item>
              <Descriptions.Item label="描述" span={2}>
                {mockData.description || '-'}
              </Descriptions.Item>
            </Descriptions>
          </TabPane>

          <TabPane tab="请求参数" key="2">
            <Table<ParamInfo>
              columns={paramColumns}
              dataSource={mockData.requestParams}
              rowKey="id"
              pagination={false}
              bordered
            />
          </TabPane>

          <TabPane tab="响应参数" key="3">
            <Table<ParamInfo>
              columns={paramColumns}
              dataSource={mockData.responseParams}
              rowKey="id"
              pagination={false}
              bordered
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default InterfaceDetail; 