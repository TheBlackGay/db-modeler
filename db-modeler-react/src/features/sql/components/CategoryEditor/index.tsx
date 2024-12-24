import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Space } from 'antd';
import type { SQLTemplateCategory } from '../../templates/types';

interface CategoryEditorProps {
  visible: boolean;
  category: SQLTemplateCategory | null;
  categories: SQLTemplateCategory[];
  onCancel: () => void;
  onSave: (category: SQLTemplateCategory) => void;
}

export const CategoryEditor: React.FC<CategoryEditorProps> = ({
  visible,
  category,
  categories,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && category) {
      form.setFieldsValue(category);
    } else {
      form.resetFields();
    }
  }, [visible, category, form]);

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
      title={category ? '编辑分类' : '新建分类'}
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
          parentId: null,
          order: 0,
        }}
      >
        <Form.Item
          name="name"
          label="分类名称"
          rules={[{ required: true, message: '请输入分类名称' }]}
        >
          <Input placeholder="请输入分类名称" />
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
        >
          <Input.TextArea placeholder="请输入分类描述" rows={2} />
        </Form.Item>

        <Form.Item
          name="parentId"
          label="父分类"
        >
          <Select allowClear>
            {categories
              .filter(c => c.id !== category?.id)
              .map(c => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="order"
          label="排序"
          rules={[{ required: true, message: '请输入排序值' }]}
        >
          <Input type="number" placeholder="请输入排序值" />
        </Form.Item>
      </Form>
    </Modal>
  );
}; 