import React from 'react';
import { Modal, Form, Input, Select, Switch } from 'antd';
import type { FieldTemplate, FieldTemplateCategory } from '../../../../types/models';

interface TemplateEditorProps {
  visible: boolean;
  template: FieldTemplate | null;
  categories: FieldTemplateCategory[];
  onCancel: () => void;
  onSave: (template: FieldTemplate) => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  visible,
  template,
  categories,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible && template) {
      form.setFieldsValue(template);
    } else {
      form.resetFields();
    }
  }, [visible, template, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSave(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={template ? '编辑模板' : '新建模板'}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          type: 'VARCHAR',
          length: 255,
          nullable: true,
          defaultValue: '',
          isPrimaryKey: false,
          isAutoIncrement: false,
          unique: false,
          index: false,
          unsigned: false,
          zerofill: false,
        }}
      >
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入描述' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="category"
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
          name="type"
          label="字段类型"
          rules={[{ required: true, message: '请选择字段类型' }]}
        >
          <Select>
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
          <Input type="number" />
        </Form.Item>

        <Form.Item name="nullable" valuePropName="checked">
          <Switch checkedChildren="可空" unCheckedChildren="不可空" />
        </Form.Item>

        <Form.Item name="defaultValue" label="默认值">
          <Input />
        </Form.Item>

        <Form.Item name="comment" label="注释">
          <Input />
        </Form.Item>

        <Form.Item name="isPrimaryKey" valuePropName="checked">
          <Switch checkedChildren="主键" unCheckedChildren="非主键" />
        </Form.Item>

        <Form.Item name="isAutoIncrement" valuePropName="checked">
          <Switch checkedChildren="自增" unCheckedChildren="非自增" />
        </Form.Item>

        <Form.Item name="unique" valuePropName="checked">
          <Switch checkedChildren="唯一" unCheckedChildren="非唯一" />
        </Form.Item>

        <Form.Item name="index" valuePropName="checked">
          <Switch checkedChildren="索引" unCheckedChildren="非索引" />
        </Form.Item>

        <Form.Item name="unsigned" valuePropName="checked">
          <Switch checkedChildren="无符号" unCheckedChildren="有符号" />
        </Form.Item>

        <Form.Item name="zerofill" valuePropName="checked">
          <Switch checkedChildren="补零" unCheckedChildren="不补零" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TemplateEditor; 