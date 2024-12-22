import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  DatePicker,
  Space,
  Tag,
  Button,
  Typography,
  Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Line } from '@ant-design/charts';
import {
  ArrowLeftOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { InterfaceLog, InterfaceStats } from '../types';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const InterfaceMonitor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [loading, setLoading] = useState(false);

  // 模拟统计数据
  const mockStats: InterfaceStats = {
    totalCalls: 1000,
    successCalls: 950,
    failureCalls: 50,
    avgResponseTime: 200,
    lastDayStats: Array.from({ length: 24 }, (_, i) => ({
      time: `${i.toString().padStart(2, '0')}:00`,
      calls: Math.floor(Math.random() * 100),
      successRate: 0.95 + Math.random() * 0.05,
      avgResponseTime: 150 + Math.random() * 100,
    })),
  };

  // 模拟日志数据
  const mockLogs: InterfaceLog[] = Array.from({ length: 10 }, (_, i) => ({
    id: i.toString(),
    interfaceId: id || '',
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    status: Math.random() > 0.1 ? 'SUCCESS' : 'FAILURE',
    requestData: '{"userId": "123"}',
    responseData: '{"username": "test"}',
    responseTime: Math.floor(150 + Math.random() * 100),
    errorMessage: Math.random() > 0.1 ? undefined : '服务器内部错误',
  }));

  // 图表配置
  const chartConfig = {
    data: mockStats.lastDayStats,
    xField: 'time',
    yField: 'calls',
    smooth: true,
    point: {
      size: 3,
    },
    tooltip: {
      showMarkers: false,
      formatter: (datum: any) => ({
        name: '调用次数',
        value: datum.calls,
      }),
    },
    xAxis: {
      label: {
        formatter: (text: string) => text,
      },
    },
    yAxis: {
      label: {
        formatter: (value: string) => `${value}次`,
      },
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red',
        },
      },
    },
    interactions: [
      {
        type: 'marker-active',
      },
    ],
  };

  // 日志表格列配置
  const logColumns: ColumnsType<InterfaceLog> = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: '15%',
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      align: 'center',
      render: (status: 'SUCCESS' | 'FAILURE') => (
        <Tag icon={status === 'SUCCESS' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={status === 'SUCCESS' ? 'success' : 'error'}>
          {status === 'SUCCESS' ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: '响应时间',
      dataIndex: 'responseTime',
      key: 'responseTime',
      width: '10%',
      align: 'center',
      render: (time: number) => (
        <Space>
          <ClockCircleOutlined />
          <span>{time}ms</span>
        </Space>
      ),
    },
    {
      title: '请求数据',
      dataIndex: 'requestData',
      key: 'requestData',
      width: '25%',
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          <Text code copyable>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: '响应数据',
      dataIndex: 'responseData',
      key: 'responseData',
      width: '25%',
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          <Text code copyable>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: '错误信息',
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      width: '15%',
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => text ? (
        <Tooltip placement="topLeft" title={text}>
          <Text type="danger">{text}</Text>
        </Tooltip>
      ) : '-',
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
      <Card
        title={
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/interface/list')}
            >
              返回
            </Button>
            <Text strong>接口监控</Text>
          </Space>
        }
        extra={
          <Button
            icon={<SyncOutlined spin={loading} />}
            onClick={handleRefresh}
          >
            刷新
          </Button>
        }
      >
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="总调用次数"
                value={mockStats.totalCalls}
                suffix="次"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="成功调用"
                value={mockStats.successCalls}
                suffix="次"
                valueStyle={{ color: '#3f8600' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="失败调用"
                value={mockStats.failureCalls}
                suffix="次"
                valueStyle={{ color: '#cf1322' }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false}>
              <Statistic
                title="平均响应时间"
                value={mockStats.avgResponseTime}
                suffix="ms"
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card title="24小时调用趋势" style={{ marginTop: 16 }} bordered={false}>
          <Line {...chartConfig} />
        </Card>

        <Card
          title="调用日志"
          style={{ marginTop: 16 }}
          bordered={false}
          extra={
            <Space>
              <RangePicker
                showTime
                onChange={(dates) => {
                  if (dates) {
                    setDateRange([
                      dates[0]?.toISOString() || '',
                      dates[1]?.toISOString() || '',
                    ]);
                  } else {
                    setDateRange(null);
                  }
                }}
              />
            </Space>
          }
        >
          <Table<InterfaceLog>
            columns={logColumns}
            dataSource={mockLogs}
            rowKey="id"
            loading={loading}
            pagination={{
              total: mockLogs.length,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
          />
        </Card>
      </Card>
    </div>
  );
};

export default InterfaceMonitor; 