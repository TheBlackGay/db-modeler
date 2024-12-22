import React from 'react';
import { Modal, Form, Input, Select, TreeSelect } from 'antd';
import type { ApiFormProps } from '../../types/api.types';
import styles from './ApiForm.module.scss';

const { Option } = Select;

const ApiForm: React.FC<ApiFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  groups,
  initialValues,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({
        ...values,
        tags: values.tags || [],
      });
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Modal
      title={initialValues ? '编辑接口' : '添加接口'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      destroyOnClose
      className={styles.apiFormModal}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        className={styles.apiForm}
      >
        <Form.Item
          name="name"
          label="接口名称"
          rules={[{ required: true, message: '请输入接口名称' }]}
        >
          <Input placeholder="请输入接口名称" />
        </Form.Item>

        <Form.Item
          name="url"
          label="接口URL"
          rules={[{ required: true, message: '请输入接口URL' }]}
        >
          <Input placeholder="请输入接口URL" />
        </Form.Item>

        <Form.Item
          name="method"
          label="请求方法"
          rules={[{ required: true, message: '请选择请求方法' }]}
        >
          <Select placeholder="请选择请求方法">
            <Option value="GET">GET</Option>
            <Option value="POST">POST</Option>
            <Option value="PUT">PUT</Option>
            <Option value="DELETE">DELETE</Option>
            <Option value="PATCH">PATCH</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="group_id"
          label="所属分组"
          rules={[{ required: true, message: '请选择所属分组' }]}
        >
          <TreeSelect
            placeholder="请选择所属分组"
            treeData={groups.map(group => ({
              title: group.name,
              value: group.id,
              key: group.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="接口状态"
          rules={[{ required: true, message: '请选择接口状态' }]}
        >
          <Select placeholder="请选择接口状态">
            <Option value="developing">开发中</Option>
            <Option value="completed">已完成</Option>
            <Option value="deprecated">已废弃</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="version"
          label="接口版本"
          rules={[{ required: true, message: '请输入接口版本' }]}
        >
          <Input placeholder="请输入接口版本" />
        </Form.Item>

        <Form.Item
          name="description"
          label="接口描述"
        >
          <Input.TextArea rows={4} placeholder="请输入接口描述" />
        </Form.Item>

        <Form.Item
          name="tags"
          label="标签"
        >
          <Select
            mode="tags"
            placeholder="请输入标签"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ApiForm; 