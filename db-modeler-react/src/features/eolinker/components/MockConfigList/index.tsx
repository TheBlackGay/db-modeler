import React from 'react';
import { Table, Button, Space, Switch, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MockConfig } from '../../types/api.types';
import styles from './MockConfigList.module.scss';

interface MockConfigListProps {
  configs: MockConfig[];
  onAdd: () => void;
  onEdit: (config: MockConfig) => void;
  onDelete: (configId: string) => void;
  onToggle: (configId: string, enabled: boolean) => void;
}

export const MockConfigList: React.FC<MockConfigListProps> = ({
  configs,
  onAdd,
  onEdit,
  onDelete,
  onToggle,
}) => {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 400 && status < 500) return 'warning';
    if (status >= 500) return 'error';
    return 'default';
  };

  const columns: ColumnsType<MockConfig> = [
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record) => (
        <Switch
          checked={enabled}
          onChange={(checked) => onToggle(record.id, checked)}
        />
      ),
    },
    {
      title: '延迟(ms)',
      dataIndex: 'delay',
      key: 'delay',
    },
    {
      title: '状态码',
      dataIndex: 'status_code',
      key: 'status_code',
      render: (status: number) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: '规则数',
      key: 'rules',
      render: (_, record) => record.rules?.length || 0,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => onEdit(record)}>编辑</a>
          <a onClick={() => onDelete(record.id)}>删除</a>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Mock配置</h3>
        <Button type="primary" onClick={onAdd}>
          添加配置
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={configs}
        rowKey="id"
        pagination={false}
        expandable={{
          expandedRowRender: (record) => (
            <pre className={styles.responseBody}>{record.response_body}</pre>
          ),
          rowExpandable: (record) => !!record.response_body,
        }}
      />
    </div>
  );
}; 