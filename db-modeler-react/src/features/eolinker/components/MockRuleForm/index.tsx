import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import type { MockRuleFormProps } from '../../types/api.types';
import styles from './MockRuleForm.module.scss';

const { Option } = Select;
const { TextArea } = Input;

const MockRuleForm: React.FC<MockRuleFormProps> = ({
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

  const ruleTypes = [
    'string',
    'number',
    'boolean',
    'array',
    'object',
    'null',
  ];

  return (
    <Modal
      title={initialValues ? '编辑Mock规则' : '添加Mock规则'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      destroyOnClose
      width={720}
      className={styles.mockRuleFormModal}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        className={styles.mockRuleForm}
      >
        <Form.Item
          name="field"
          label="字段名称"
          rules={[{ required: true, message: '请输入字段名称' }]}
        >
          <Input placeholder="请输入字段名称，支持点号表示嵌套字段，如：data.list.id" />
        </Form.Item>

        <Form.Item
          name="type"
          label="字段类型"
          rules={[{ required: true, message: '请选择字段类型' }]}
        >
          <Select placeholder="请选择字段类型">
            {ruleTypes.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="rule"
          label="Mock规则"
          rules={[{ required: true, message: '请输入Mock规则' }]}
          help="支持Mock.js语法，如：@string(5,10)、@integer(1,100)等"
        >
          <TextArea rows={4} placeholder="请输入Mock规则" />
        </Form.Item>

        <Form.Item
          name="description"
          label="规则说明"
        >
          <TextArea rows={2} placeholder="请输入规则说明" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MockRuleForm; 