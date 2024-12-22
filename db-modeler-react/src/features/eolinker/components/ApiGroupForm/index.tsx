import React from 'react';
import { Modal, Form, Input } from 'antd';
import type { ApiGroupFormProps } from '../../types/api.types';
import styles from './ApiGroupForm.module.scss';

const ApiGroupForm: React.FC<ApiGroupFormProps> = ({
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
        order: values.order || 0,
      });
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Modal
      title={initialValues ? '编辑分组' : '添加分组'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      destroyOnClose
      className={styles.apiGroupFormModal}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        className={styles.apiGroupForm}
      >
        <Form.Item
          name="name"
          label="分组名称"
          rules={[{ required: true, message: '请输入分组名称' }]}
        >
          <Input placeholder="请输入分组名称" />
        </Form.Item>

        <Form.Item
          name="description"
          label="分组描述"
        >
          <Input.TextArea rows={4} placeholder="请输入分组描述" />
        </Form.Item>

        <Form.Item
          name="order"
          label="排序"
          tooltip="数字越小越靠前"
        >
          <Input type="number" placeholder="请输入排序号" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ApiGroupForm; 