import React, { useState } from 'react';
import { Card, Table, Button, Space, Form, Select, Input, Modal } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Field, Table as TableType } from '../../types/models';

const { Option } = Select;

interface FieldWithTable extends Field {
  table: {
    id: string;
    name: string;
  };
}

const BatchEdit: React.FC = () => {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const currentProject = useSelector((state: RootState) => state.projects.currentProject);

  const columns = [
    {
      title: '表名',
      dataIndex: ['table', 'name'],
      key: 'tableName',
    },
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
  ];

  const handleBatchEdit = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const fields = currentProject?.tables.flatMap((table: TableType) =>
    table.fields.map((field: Field): FieldWithTable => ({
      ...field,
      table: {
        id: table.id,
        name: table.name,
      },
    }))
  ) || [];

  return (
    <>
      <Card
        title="批量编辑"
        extra={
          <Space>
            <Button
              type="primary"
              onClick={handleBatchEdit}
              disabled={selectedFields.length === 0}
            >
              批量修改
            </Button>
            <Button>导入</Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={fields}
          rowKey="id"
          rowSelection={{
            selectedRowKeys: selectedFields,
            onChange: (selectedRowKeys) => setSelectedFields(selectedRowKeys as string[]),
          }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <Modal
        title="批量修改字段"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="数据类型">
            <Select placeholder="选择数据类型">
              <Option value="varchar">VARCHAR</Option>
              <Option value="int">INT</Option>
              <Option value="datetime">DATETIME</Option>
            </Select>
          </Form.Item>
          <Form.Item label="长度/精度">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="允许空">
            <Select>
              <Option value="true">是</Option>
              <Option value="false">否</Option>
            </Select>
          </Form.Item>
          <Form.Item label="默认值">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BatchEdit; 