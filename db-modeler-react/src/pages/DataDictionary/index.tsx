import React from 'react';
import { Card, Table, Button, Space, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Table as TableType, Field } from '../../types/models';

const { Title, Text } = Typography;

const DataDictionary: React.FC = () => {
  const currentProject = useSelector((state: RootState) => state.projects.currentProject);

  const columns = [
    {
      title: '字段名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '长度/精度',
      dataIndex: 'length',
      key: 'length',
    },
    {
      title: '允许空',
      dataIndex: 'nullable',
      key: 'nullable',
      render: (nullable: boolean) => (nullable ? '是' : '否'),
    },
    {
      title: '默认值',
      dataIndex: 'defaultValue',
      key: 'defaultValue',
    },
    {
      title: '主键',
      dataIndex: 'isPrimaryKey',
      key: 'isPrimaryKey',
      render: (isPrimaryKey: boolean) => (isPrimaryKey ? '是' : '否'),
    },
    {
      title: '外键',
      dataIndex: 'isForeignKey',
      key: 'isForeignKey',
      render: (isForeignKey: boolean) => (isForeignKey ? '是' : '否'),
    },
  ];

  const renderTableFields = (table: TableType) => (
    <Card key={table.id} style={{ marginBottom: 16 }}>
      <Title level={4}>{table.name}</Title>
      <Text type="secondary">{table.description}</Text>
      <Table
        columns={columns}
        dataSource={table.fields}
        rowKey="id"
        pagination={false}
        size="small"
        style={{ marginTop: 16 }}
      />
    </Card>
  );

  return (
    <Card
      title="数据字典"
      extra={
        <Space>
          <Button type="primary">导出文档</Button>
          <Button>打印</Button>
        </Space>
      }
    >
      {currentProject?.tables.map(renderTableFields)}
    </Card>
  );
};

export default DataDictionary; 