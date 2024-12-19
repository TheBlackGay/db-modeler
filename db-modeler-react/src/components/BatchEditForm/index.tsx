import React from 'react';
import { Modal, Form, Select, Switch } from 'antd';
import type { Field } from '../../types/models';

interface BatchEditFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Partial<Field>) => void;
  selectedCount: number;
}

const BatchEditForm: React.FC<BatchEditFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  selectedCount,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      // 只提交已更改的字段
      const changedValues = Object.entries(values)
        .filter(([_, value]) => value !== undefined)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      
      onSubmit(changedValues);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={`批量编辑字段 (已选择 ${selectedCount} 个字段)`}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleSubmit}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          label="类型"
          name="type"
        >
          <Select allowClear>
            <Select.Option value="INT">INT</Select.Option>
            <Select.Option value="VARCHAR">VARCHAR</Select.Option>
            <Select.Option value="TEXT">TEXT</Select.Option>
            <Select.Option value="DATETIME">DATETIME</Select.Option>
            <Select.Option value="DECIMAL">DECIMAL</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="允许为空"
          name="nullable"
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

export default BatchEditForm; 