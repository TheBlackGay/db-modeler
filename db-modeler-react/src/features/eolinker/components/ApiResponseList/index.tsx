import React from 'react';
import { Table, Button, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { ApiResponse } from '../../types/api.types';
import styles from './ApiResponseList.module.scss';

interface ApiResponseListProps {
  responses: ApiResponse[];
  onAdd: () => void;
  onEdit: (response: ApiResponse) => void;
  onDelete: (responseId: string) => void;
}

export const ApiResponseList: React.FC<ApiResponseListProps> = ({
  responses,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 400 && status < 500) return 'warning';
    if (status >= 500) return 'error';
    return 'default';
  };

  const columns: ColumnsType<ApiResponse> = [
    {
      title: '状态码',
      dataIndex: 'status_code',
      key: 'status_code',
      render: (status: number) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: '响应类型',
      dataIndex: 'content_type',
      key: 'content_type',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
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
        <h3>响应定义</h3>
        <Button type="primary" onClick={onAdd}>
          添加响应
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={responses}
        rowKey="id"
        pagination={false}
        expandable={{
          expandedRowRender: (record) => (
            <pre className={styles.responseBody}>{record.body}</pre>
          ),
          rowExpandable: (record) => !!record.body,
        }}
      />
    </div>
  );
}; 