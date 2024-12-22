import React from 'react';
import { Table, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { ApiParam } from '../../types/api.types';
import styles from './ApiParamList.module.scss';

interface ApiParamListProps {
  params: ApiParam[];
  onAdd: () => void;
  onEdit: (param: ApiParam) => void;
  onDelete: (paramId: string) => void;
}

export const ApiParamList: React.FC<ApiParamListProps> = ({
  params,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const columns: ColumnsType<ApiParam> = [
    {
      title: '参数名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '是否必填',
      dataIndex: 'required',
      key: 'required',
      render: (required: boolean) => (required ? '是' : '否'),
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
        <h3>请求参数</h3>
        <Button type="primary" onClick={onAdd}>
          添加参数
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={params}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
}; 