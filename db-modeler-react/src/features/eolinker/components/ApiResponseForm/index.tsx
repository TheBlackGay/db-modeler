import React from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';
import type { ApiResponseFormProps, ResponseType, ResponseStatus } from '../../types/api.types';
import styles from './ApiResponseForm.module.scss';

const { Option } = Select;
const { TextArea } = Input;

const ApiResponseForm: React.FC<ApiResponseFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const responseTypes: ResponseType[] = [
    'object',
    'array',
    'string',
    'number',
    'boolean',
    'null',
  ];

  const responseStatuses: ResponseStatus[] = [
    200, 201, 400, 401, 403, 404, 500, 502, 503, 504,
  ];

  return (
    <Modal
      title={initialValues ? '编辑响应' : '添加响应'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      destroyOnClose
      width={720}
      className={styles.apiResponseFormModal}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        className={styles.apiResponseForm}
      >
        <Form.Item
          name="status"
          label="状态码"
          rules={[{ required: true, message: '请选择状态码' }]}
        >
          <Select placeholder="请选择状态码">
            {responseStatuses.map(status => (
              <Option key={status} value={status}>{status}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="type"
          label="响应类型"
          rules={[{ required: true, message: '请选择响应类型' }]}
        >
          <Select placeholder="请选择响应类型">
            {responseTypes.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="响应描述"
        >
          <TextArea rows={2} placeholder="请输入响应描述" />
        </Form.Item>

        <Form.Item
          name="example"
          label="示例数据"
        >
          <TextArea rows={4} placeholder="请输入JSON格式的示例数据" />
        </Form.Item>

        <Form.Item
          name="schema"
          label="数据结构"
          help="请输入JSON Schema格式的数据结构定义"
        >
          <TextArea rows={6} placeholder="请输入JSON Schema格式的数据结构定义" />
        </Form.Item>

        <Form.Item
          name="mock_rule"
          label="Mock规则"
          help="请输入Mock.js规则"
        >
          <TextArea rows={4} placeholder="请输入Mock.js规则" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ApiResponseForm; 