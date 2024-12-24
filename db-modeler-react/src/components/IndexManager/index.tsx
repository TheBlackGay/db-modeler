import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Table as TableType, Field, Index } from '../../types/models';

interface IndexManagerProps {
  visible: boolean;
  onClose: () => void;
  table: TableType;
  onUpdateIndexes: (indexes: Index[]) => void;
}

const IndexManager: React.FC<IndexManagerProps> = ({
  visible,
  onClose,
  table,
  onUpdateIndexes,
}) => {
  const [form] = Form.useForm();
  const [editingIndex, setEditingIndex] = useState<Index | null>(null);
  const [showIndexForm, setShowIndexForm] = useState(false);

  const handleAddIndex = () => {
    setEditingIndex(null);
    form.resetFields();
    setShowIndexForm(true);
  };

  const handleEditIndex = (index: Index) => {
    setEditingIndex(index);
    form.setFieldsValue({
      name: index.name,
      fields: index.fields,
      type: index.type,
    });
    setShowIndexForm(true);
  };

  const handleDeleteIndex = (indexName: string) => {
    const updatedIndexes = table.indexes?.filter(idx => idx.name !== indexName) || [];
    onUpdateIndexes(updatedIndexes);
    message.success('索引删除成功');
  };

  const handleSubmit = (values: any) => {
    const newIndex: Index = {
      name: values.name,
      fields: values.fields,
      type: values.type,
    };

    let updatedIndexes: Index[] = [];
    if (editingIndex) {
      updatedIndexes = table.indexes?.map(idx => 
        idx.name === editingIndex.name ? newIndex : idx
      ) || [];
      message.success('索引更新成功');
    } else {
      updatedIndexes = [...(table.indexes || []), newIndex];
      message.success('索引创建成功');
    }

    onUpdateIndexes(updatedIndexes);
    setShowIndexForm(false);
    setEditingIndex(null);
    form.resetFields();
  };

  const columns = [
    {
      title: '索引名称',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    },
    {
      title: '字段',
      dataIndex: 'fields',
      key: 'fields',
      width: '35%',
      render: (fields: string[]) => fields.join(', '),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: '20%',
    },
    {
      title: '操作',
      key: 'action',
      width: '20%',
      render: (_: any, record: Index) => (
        <Space>
          <Button
            type="text"
            onClick={() => handleEditIndex(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            danger
            onClick={() => handleDeleteIndex(record.name)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title="索引管理"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddIndex}
        >
          添加索引
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={table.indexes || []}
        rowKey="name"
        pagination={false}
      />

      <Modal
        title={editingIndex ? "编辑索引" : "新建索引"}
        open={showIndexForm}
        onOk={() => form.submit()}
        onCancel={() => {
          setShowIndexForm(false);
          setEditingIndex(null);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="索引名称"
            rules={[
              { required: true, message: '请输入索引名称' },
              { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '索引名称只能包含字母、数字和下划线，且必须以字母开头' },
            ]}
          >
            <Input placeholder="请输入索引名称" />
          </Form.Item>

          <Form.Item
            name="fields"
            label="索引字段"
            rules={[{ required: true, message: '请选择索引字段' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择索引字段"
            >
              {table.fields?.map(field => (
                <Select.Option key={field.name} value={field.name}>
                  {field.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="索引类型"
            rules={[{ required: true, message: '请选择索引类型' }]}
          >
            <Select placeholder="请选择索引类型">
              <Select.Option value="NORMAL">普通索引</Select.Option>
              <Select.Option value="UNIQUE">唯一索引</Select.Option>
              <Select.Option value="FULLTEXT">全文索引</Select.Option>
              <Select.Option value="SPATIAL">空间索引</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Modal>
  );
};

export default IndexManager;