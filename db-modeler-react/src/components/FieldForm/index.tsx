import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Switch } from 'antd';
import type { Field } from '../../types/models';

interface FieldFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Partial<Field>) => void;
  initialValues?: Field;
}

const FieldForm: React.FC<FieldFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
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
    });
  };

  return (
    <Modal
      title={initialValues ? '编辑字段' : '添加字段'}
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
          nullable: true,
          defaultValue: '',
          comment: '',
          isPrimaryKey: false,
          isAutoIncrement: false,
          unique: false,
          index: false,
          unsigned: false,
          zerofill: false,
        }}
      >
        <Form.Item
          label="字段名"
          name="name"
          rules={[{ required: true, message: '请输入字段名' }]}
        >
          <Input placeholder="请输入字段名" />
        </Form.Item>

        <Form.Item
          label="类型"
          name="type"
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
          label="长度"
          name="length"
        >
          <InputNumber min={1} placeholder="请输入字段长度" />
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

        <Form.Item
          label="注释"
          name="comment"
        >
          <Input.TextArea rows={4} placeholder="请输入字段注释" />
        </Form.Item>

        <Form.Item
          label="主键"
          name="isPrimaryKey"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="自增"
          name="isAutoIncrement"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="唯一"
          name="unique"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="索引"
          name="index"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="无符号"
          name="unsigned"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="补零"
          name="zerofill"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FieldForm; 