import React, { useEffect } from 'react';
import { Form, Input, Select, Switch, Modal, InputNumber } from 'antd';
import type { Field } from '../../types/models';

const { Option } = Select;

interface FieldFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<Field, 'id'>) => void;
  initialValues?: Field | null;
}

const dataTypes = [
  { value: 'INT', label: 'INT - 整数' },
  { value: 'BIGINT', label: 'BIGINT - 长整数' },
  { value: 'VARCHAR', label: 'VARCHAR - 可变字符串' },
  { value: 'TEXT', label: 'TEXT - 长文本' },
  { value: 'DATETIME', label: 'DATETIME - 日期时间' },
  { value: 'BOOLEAN', label: 'BOOLEAN - 布尔值' },
  { value: 'DECIMAL', label: 'DECIMAL - 小数' },
  { value: 'FLOAT', label: 'FLOAT - 浮点数' },
];

const needLengthTypes = ['VARCHAR', 'INT', 'BIGINT', 'DECIMAL'];

const FieldForm: React.FC<FieldFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const type = Form.useWatch('type', form);
  const isPrimaryKey = Form.useWatch('isPrimaryKey', form);

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, initialValues, form]);

  useEffect(() => {
    if (isPrimaryKey) {
      form.setFieldValue('nullable', false);
    }
  }, [isPrimaryKey, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={initialValues ? '编辑字段' : '添加字段'}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          nullable: false,
          isPrimaryKey: false,
          isAutoIncrement: false,
          ...initialValues,
        }}
        preserve={false}
      >
        <Form.Item
          name="name"
          label="字段名"
          rules={[
            { required: true, message: '请输入字段名' },
            { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: '字段名只能包含字母、数字和下划线，且不能以数字开头' },
          ]}
        >
          <Input placeholder="例如：user_name" />
        </Form.Item>

        <Form.Item
          name="type"
          label="数据类型"
          rules={[{ required: true, message: '请选择数据类型' }]}
        >
          <Select>
            {dataTypes.map(({ value, label }) => (
              <Option key={value} value={value}>
                {label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {needLengthTypes.includes(type) && (
          <Form.Item
            name="length"
            label="长度"
            rules={[{ required: true, message: '请输入长度' }]}
          >
            <InputNumber min={1} max={type === 'VARCHAR' ? 65535 : 255} />
          </Form.Item>
        )}

        <Form.Item
          name="isPrimaryKey"
          label="主键"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        {isPrimaryKey && ['INT', 'BIGINT'].includes(type) && (
          <Form.Item
            name="isAutoIncrement"
            label="自增"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        )}

        <Form.Item
          name="nullable"
          label="允许为空"
          valuePropName="checked"
        >
          <Switch disabled={isPrimaryKey} />
        </Form.Item>

        <Form.Item
          name="defaultValue"
          label="默认值"
        >
          <Input placeholder="留空表示无默认值" />
        </Form.Item>

        <Form.Item
          name="comment"
          label="注释"
        >
          <Input.TextArea rows={2} placeholder="请输入字段说明" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FieldForm; 