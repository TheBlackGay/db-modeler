import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Space } from 'antd';
import type { SQLTemplate, SQLTemplateCategory } from '../../templates/types';

interface TemplateEditorProps {
  visible: boolean;
  template: SQLTemplate | null;
  categories: SQLTemplateCategory[];
  onCancel: () => void;
  onSave: (template: SQLTemplate) => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  visible,
  template,
  categories,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && template) {
      form.setFieldsValue(template);
    } else {
      form.resetFields();
    }
  }, [visible, template, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Modal
      title={template ? '编辑模板' : '新建模板'}
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
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          dialect: 'mysql',
          categoryId: categories[0]?.id,
        }}
      >
        <Form.Item
          name="name"
          label="模板名称"
          rules={[{ required: true, message: '请输入模板名称' }]}
        >
          <Input placeholder="请输入模板名称" />
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入模板描述' }]}
        >
          <Input.TextArea placeholder="请输入模板描述" rows={2} />
        </Form.Item>

        <Form.Item
          name="dialect"
          label="数据库类型"
          rules={[{ required: true, message: '请选择数据库类型' }]}
        >
          <Select>
            <Select.Option value="mysql">MySQL</Select.Option>
            <Select.Option value="postgresql">PostgreSQL</Select.Option>
            <Select.Option value="oracle">Oracle</Select.Option>
            <Select.Option value="sqlserver">SQL Server</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="分类"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Select>
            {categories.map(category => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="content"
          label="模板内容"
          rules={[{ required: true, message: '请输入模板内容' }]}
        >
          <Input.TextArea placeholder="请输入模板内容" rows={10} />
        </Form.Item>
      </Form>
    </Modal>
  );
}; 