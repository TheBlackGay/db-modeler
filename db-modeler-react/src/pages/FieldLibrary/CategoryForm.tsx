import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { StandardFieldCategory } from '../../types/models';

interface CategoryFormProps {
  category: StandardFieldCategory | null;
  visible: boolean;
  onClose: () => void;
  categories: StandardFieldCategory[];
}

const { Option } = Select;
const { TextArea } = Input;

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  visible,
  onClose,
  categories,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // TODO: 处理表单提交
      onClose();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={category ? '编辑分类' : '添加分类'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      width={520}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={category || {
          type: 'custom',
          order: categories.length,
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
          name="type"
          label="分类类型"
          rules={[{ required: true, message: '请选择分类类型' }]}
        >
          <Select placeholder="请选择分类类型">
            <Option value="business">业务域</Option>
            <Option value="technical">技术类型</Option>
            <Option value="custom">自定义</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="parentId"
          label="父级分类"
        >
          <Select
            placeholder="请选择父级分类"
            allowClear
          >
            {categories
              .filter(cat => !cat.parentId && cat.id !== category?.id)
              .map(cat => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
        >
          <TextArea rows={4} placeholder="请输入分类描述" />
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

export default CategoryForm; 