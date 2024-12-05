import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Table, 
  DatePicker, 
  Select, 
  Row, 
  Col, 
  Tag,
  Tooltip
} from 'antd';
import { 
  FileSearchOutlined, 
  ClockCircleOutlined, 
  UserOutlined, 
  DatabaseOutlined 
} from '@ant-design/icons';
import { adminService } from '@/services/api';
import moment from 'moment';

const { Content } = Layout;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface AuditLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  ipAddress: string;
  status: 'success' | 'failure';
}

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    actionType: null,
    entityType: null
  });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  useEffect(() => {
    fetchAuditLogs();
  }, [filters, pagination.current]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...filters
      };
      const result = await adminService.getAuditLogs(params);
      setLogs(result.logs);
      setPagination(prev => ({
        ...prev,
        total: result.total
      }));
    } catch (error) {
      console.error('获取审计日志失败', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates: any) => {
    setFilters(prev => ({
      ...prev,
      startDate: dates ? dates[0].toISOString() : null,
      endDate: dates ? dates[1].toISOString() : null
    }));
  };

  const handleActionTypeChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      actionType: value
    }));
  };

  const handleEntityTypeChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      entityType: value
    }));
  };

  const columns = [
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
      render: (username: string) => (
        <Tooltip title={username}>
          <UserOutlined /> {username}
        </Tooltip>
      )
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => {
        const actionColors = {
          create: 'green',
          update: 'blue',
          delete: 'red',
          login: 'purple',
          logout: 'orange'
        };
        return (
          <Tag color={actionColors[action as keyof typeof actionColors] || 'default'}>
            {action}
          </Tag>
        );
      }
    },
    {
      title: '实体类型',
      dataIndex: 'entityType',
      key: 'entityType',
      render: (entityType: string) => (
        <Tooltip title={entityType}>
          <DatabaseOutlined /> {entityType}
        </Tooltip>
      )
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => (
        <Tooltip title={moment(timestamp).format('YYYY-MM-DD HH:mm:ss')}>
          <ClockCircleOutlined /> {moment(timestamp).fromNow()}
        </Tooltip>
      )
    },
    {
      title: 'IP地址',
      dataIndex: 'ipAddress',
      key: 'ipAddress'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusColors = {
          success: 'green',
          failure: 'red'
        };
        return (
          <Tag color={statusColors[status as keyof typeof statusColors]}>
            {status === 'success' ? '成功' : '失败'}
          </Tag>
        );
      }
    }
  ];

  return (
    <Layout>
      <Content style={{ padding: 24 }}>
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FileSearchOutlined style={{ marginRight: 8 }} />
              审计日志
            </div>
          }
        >
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <RangePicker 
                style={{ width: '100%' }}
                onChange={handleDateRangeChange}
              />
            </Col>
            <Col span={8}>
              <Select 
                style={{ width: '100%' }} 
                placeholder="操作类型"
                allowClear
                onChange={handleActionTypeChange}
              >
                <Option value="create">创建</Option>
                <Option value="update">更新</Option>
                <Option value="delete">删除</Option>
                <Option value="login">登录</Option>
                <Option value="logout">登出</Option>
              </Select>
            </Col>
            <Col span={8}>
              <Select 
                style={{ width: '100%' }} 
                placeholder="实体类型"
                allowClear
                onChange={handleEntityTypeChange}
              >
                <Option value="user">用户</Option>
                <Option value="database">数据库</Option>
                <Option value="table">表结构</Option>
              </Select>
            </Col>
          </Row>
          <Table 
            columns={columns}
            dataSource={logs}
            rowKey="id"
            loading={loading}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`
            }}
            onChange={(newPagination) => {
              setPagination(prev => ({
                ...prev,
                current: newPagination.current || 1,
                pageSize: newPagination.pageSize || 10
              }));
            }}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default AuditLogs;
