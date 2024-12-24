import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, Button, Space } from 'antd';
import type { Project } from '../../types/models';

interface FieldEditorProps {
  visible: boolean;
  table: any;
  project: Project;
  onCancel: () => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({
  visible,
  table,
  project,
  onCancel,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && table) {
      form.setFieldsValue(table);
    } else {
      form.resetFields();
    }
  }, [visible, table, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      // TODO: 实现字段保存逻辑
      onCancel();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Modal
      title={table ? '编辑字段' : '新建字段'}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Space key="actions">
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={handleSave}>
            保存
          </Button>
        </Space>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          type: 'varchar',
          nullable: true,
          primaryKey: false,
          autoIncrement: false,
          unique: false,
        }}
      >
        <Form.Item
          name="name"
          label="字段名"
          rules={[{ required: true, message: '请输入字段名' }]}
        >
          <Input placeholder="请输入字段名" />
        </Form.Item>

        <Form.Item
          name="type"
          label="类型"
          rules={[{ required: true, message: '请选择字段类型' }]}
        >
          <Select>
            <Select.Option value="varchar">VARCHAR</Select.Option>
            <Select.Option value="int">INT</Select.Option>
            <Select.Option value="decimal">DECIMAL</Select.Option>
            <Select.Option value="datetime">DATETIME</Select.Option>
            <Select.Option value="text">TEXT</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="length"
          label="长度"
          rules={[{ type: 'number', message: '请输入有效的长度' }]}
        >
          <Input type="number" placeholder="请输入长度" />
        </Form.Item>

        <Form.Item name="nullable" valuePropName="checked" label="可空">
          <Switch />
        </Form.Item>

        <Form.Item name="primaryKey" valuePropName="checked" label="主键">
          <Switch />
        </Form.Item>

        <Form.Item name="autoIncrement" valuePropName="checked" label="自增">
          <Switch />
        </Form.Item>

        <Form.Item name="unique" valuePropName="checked" label="唯一">
          <Switch />
        </Form.Item>

        <Form.Item name="defaultValue" label="默认值">
          <Input placeholder="请输入默认值" />
        </Form.Item>

        <Form.Item name="description" label="描述">
          <Input.TextArea placeholder="请输入字段描述" rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FieldEditor; 