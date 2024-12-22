import React from 'react';
import { Modal, Form, Input, InputNumber, Switch, Select } from 'antd';
import type { MockConfigFormProps } from '../../types/api.types';
import styles from './MockConfigForm.module.scss';

const { TextArea } = Input;

const MockConfigForm: React.FC<MockConfigFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({
        ...values,
        headers: values.headers ? JSON.parse(values.headers) : undefined,
      });
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Modal
      title={initialValues ? '编辑Mock配置' : '添加Mock配置'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      destroyOnClose
      width={720}
      className={styles.mockConfigFormModal}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...initialValues,
          headers: initialValues?.headers ? JSON.stringify(initialValues.headers, null, 2) : undefined,
        }}
        className={styles.mockConfigForm}
      >
        <Form.Item
          name="enabled"
          label="启用状态"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="delay"
          label="响应延迟"
          help="单位：毫秒"
        >
          <InputNumber min={0} max={10000} />
        </Form.Item>

        <Form.Item
          name="status_code"
          label="响应状态码"
        >
          <InputNumber min={100} max={599} />
        </Form.Item>

        <Form.Item
          name="headers"
          label="响应头"
          help="请输入JSON格式的响应头"
        >
          <TextArea
            rows={4}
            placeholder="{\n  &quot;Content-Type&quot;: &quot;application/json&quot;\n}"
          />
        </Form.Item>

        <Form.Item
          name="response_body"
          label="响应体"
          help="支持Mock.js语法"
        >
          <TextArea
            rows={6}
            placeholder="{\n  &quot;code&quot;: 200,\n  &quot;message&quot;: &quot;success&quot;,\n  &quot;data&quot;: {}\n}"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MockConfigForm; 