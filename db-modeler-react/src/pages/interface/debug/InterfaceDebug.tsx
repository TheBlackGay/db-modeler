import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Table, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { RootState } from '../../../store';
import { useTemplates } from '../../../features/sql/hooks/useTemplates';

const InterfaceDebug: React.FC = () => {
  const history = useSelector((state: RootState) => state.history);
  const { templates } = useTemplates();
  const [selectedHistory, setSelectedHistory] = useState(null);

  const columns = [
    {
      title: '接口名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: '请求路径',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: '状态码',
      dataIndex: 'statusCode',
      key: 'statusCode',
    },
    {
      title: '响应时间',
      dataIndex: 'responseTime',
      key: 'responseTime',
      render: (text: number) => `${text}ms`,
    },
    {
      title: '请求时间',
      dataIndex: 'requestTime',
      key: 'requestTime',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => setSelectedHistory(record)}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Table columns={columns} dataSource={history.items} rowKey="id" />
    </div>
  );
};

export default InterfaceDebug; 