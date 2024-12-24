import React, { useState } from 'react';
import { Drawer, Tabs, Form, Input, Select, InputNumber, Switch, Space, Button, Table, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { Field } from '../../types/models';
import { fieldTypes } from '../../types';

const { TabPane } = Tabs;
const { Title } = Typography;

interface FieldManagerProps {
  visible: boolean;
  onClose: () => void;
  fields: Field[];
  onFieldUpdate: (field: Field) => void;
  onFieldDelete: (fieldId: string) => void;
  onFieldAdd: (field: Field) => void;
}

const FieldManager: React.FC<FieldManagerProps> = ({
  visible,
  onClose,
  fields,
  onFieldUpdate,
  onFieldDelete,
  onFieldAdd,
}) => {
  const [form] = Form.useForm();
  const [sampleData, setSampleData] = useState<Record<string, any>[]>([]);
  const [editingField, setEditingField] = useState<Field | null>(null);

  // 生成示例数据
  const generateSampleData = () => {
    const newSampleData = fields.map(field => {
      let value;
      switch (field.type.toLowerCase()) {
        case 'int':
        case 'bigint':
          value = Math.floor(Math.random() * 1000);
          break;
        case 'varchar':
        case 'char':
          value = `Sample ${Math.random().toString(36).substring(7)}`;
          break;
        case 'decimal':
          value = (Math.random() * 1000).toFixed(2);
          break;
        case 'datetime':
          value = new Date().toISOString();
          break;
        case 'boolean':
          value = Math.random() > 0.5;
          break;
        default:
          value = null;
      }
      return { [field.name]: value };
    }).reduce((acc, curr) => ({ ...acc, ...curr }), {});

    setSampleData(prev => [...prev, newSampleData]);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingField) {
        onFieldUpdate({ ...editingField, ...values });
      } else {
        onFieldAdd({ ...values, id: Date.now().toString() });
      }
      form.resetFields();
      setEditingField(null);
    });
  };

  const columns = fields.map(field => ({
    title: field.name,
    dataIndex: field.name,
    key: field.name,
    render: (text: any) => <span>{String(text)}</span>,
  }));

  const fieldColumns = [
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
      title: '操作',
      key: 'action',
      render: (_: any, record: Field) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingField(record);
              form.setFieldsValue(record);
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onFieldDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Drawer
      title="字段管理"
      placement="right"
      width={800}
      onClose={onClose}
      open={visible}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="字段列表" key="1">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Table
              dataSource={fields}
              columns={fieldColumns}
              rowKey="id"
              size="small"
              pagination={false}
            />
            <Title level={5}>添加/编辑字段</Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item
                label="字段名"
                name="name"
                rules={[
                  { required: true, message: '请输入字段名' },
                  { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: '字段名只能包含字母、数字和下划线，且必须以字母或下划线开头' }
                ]}
              >
                <Input placeholder="请输入字段名" />
              </Form.Item>

              <Form.Item
                label="类型"
                name="type"
                rules={[{ required: true, message: '请选择字段类型' }]}
              >
                <Select>
                  {fieldTypes.map(type => (
                    <Select.Option key={type.value} value={type.value}>
                      {type.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="允许为空"
                name="nullable"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="默认值"
                name="defaultValue"
              >
                <Input placeholder="请输入默认值" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {editingField ? '更新字段' : '添加字段'}
                </Button>
                {editingField && (
                  <Button
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      setEditingField(null);
                      form.resetFields();
                    }}
                  >
                    取消
                  </Button>
                )}
              </Form.Item>
            </Form>
          </Space>
        </TabPane>

        <TabPane tab="示例数据" key="2">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={generateSampleData}
            >
              生成示例数据
            </Button>
            <Table
              dataSource={sampleData}
              columns={columns}
              rowKey={() => Math.random().toString()}
              size="small"
              scroll={{ x: true }}
            />
          </Space>
        </TabPane>
      </Tabs>
    </Drawer>
  );
};

export default FieldManager; 