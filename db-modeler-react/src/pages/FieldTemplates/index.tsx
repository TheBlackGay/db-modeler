import React from 'react';
import { Card, Table, Button, Space, Tag } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { FieldTemplate } from '../../types/models';

const FieldTemplates: React.FC = () => {
  const templates = useSelector((state: RootState) => state.templates.items);

  const columns = [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: FieldTemplate) => (
        <Space size="middle">
          <Button type="link">编辑</Button>
          <Button type="link" danger>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="字段模板管理"
      extra={
        <Button type="primary">
          新建模板
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={templates}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </Card>
  );
};

export default FieldTemplates; 