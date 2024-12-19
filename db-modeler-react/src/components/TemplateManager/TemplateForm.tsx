import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Switch } from 'antd';
import type { FieldTemplate, FieldTemplateCategory } from '../../types/models';

interface TemplateFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Partial<FieldTemplate>) => void;
  initialValues?: FieldTemplate;
  categories: FieldTemplateCategory[];
}

const TemplateForm: React.FC<TemplateFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  categories,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit({
        ...values,
        length: values.length ? Number(values.length) : undefined,
      });
      form.resetFields();
    });
  };

  return (
    <Modal
      title={initialValues ? '编辑模板' : '添加模板'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="确定"
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          type: 'VARCHAR',
          length: 255,
          nullable: true,
          defaultValue: '',
          comment: '',
          isPrimaryKey: false,
          isAutoIncrement: false,
          unique: false,
          index: false,
          unsigned: false,
          zerofill: false,
          isBuiltin: false,
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
          rules={[{ required: true, message: '请输入描述' }]}
        >
          <Input.TextArea rows={3} placeholder="请输入描述" />
        </Form.Item>

        <Form.Item
          name="category"
          label="分类"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Select placeholder="请选择分类">
            {categories.map(category => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="type"
          label="字段类型"
          rules={[{ required: true, message: '请选择字段类型' }]}
        >
          <Select placeholder="请选择字段类型">
            <Select.Option value="INT">INT</Select.Option>
            <Select.Option value="VARCHAR">VARCHAR</Select.Option>
            <Select.Option value="TEXT">TEXT</Select.Option>
            <Select.Option value="DATETIME">DATETIME</Select.Option>
            <Select.Option value="DECIMAL">DECIMAL</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="length"
          label="长度"
          rules={[{ type: 'number', message: '请输入有效的长度' }]}
        >
          <Input type="number" placeholder="请输入字段长度" />
        </Form.Item>

        <Form.Item
          name="nullable"
          valuePropName="checked"
          label="允许为空"
        >
          <Switch checkedChildren="可空" unCheckedChildren="不可空" />
        </Form.Item>

        <Form.Item
          name="defaultValue"
          label="默认值"
        >
          <Input placeholder="请输入默认值" />
        </Form.Item>

        <Form.Item
          name="comment"
          label="注释"
        >
          <Input placeholder="请输入注释" />
        </Form.Item>

        <Form.Item
          name="isPrimaryKey"
          valuePropName="checked"
          label="主键"
        >
          <Switch checkedChildren="主键" unCheckedChildren="非主键" />
        </Form.Item>

        <Form.Item
          name="isAutoIncrement"
          valuePropName="checked"
          label="自增"
        >
          <Switch checkedChildren="自增" unCheckedChildren="非自增" />
        </Form.Item>

        <Form.Item
          name="unique"
          valuePropName="checked"
          label="唯一"
        >
          <Switch checkedChildren="唯一" unCheckedChildren="非唯一" />
        </Form.Item>

        <Form.Item
          name="index"
          valuePropName="checked"
          label="索引"
        >
          <Switch checkedChildren="索引" unCheckedChildren="非索引" />
        </Form.Item>

        <Form.Item
          name="unsigned"
          valuePropName="checked"
          label="无符号"
        >
          <Switch checkedChildren="无符号" unCheckedChildren="有符号" />
        </Form.Item>

        <Form.Item
          name="zerofill"
          valuePropName="checked"
          label="补零"
        >
          <Switch checkedChildren="补零" unCheckedChildren="不补零" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TemplateForm; 