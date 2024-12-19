import React from 'react';
import { Modal, Form, Select } from 'antd';
import type { Table } from '../../types/models';

const { Option } = Select;

interface TableSelectModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (targetTableId: string) => void;
  tables: Table[];
  currentTableId: string;
}

const TableSelectModal: React.FC<TableSelectModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  tables,
  currentTableId,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values.targetTableId);
    } catch (error) {
      // 表单验证失败
    }
  };

  return (
    <Modal
      title="选择目标表"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={400}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="targetTableId"
          label="目标表"
          rules={[{ required: true, message: '请选择目标表' }]}
        >
          <Select placeholder="请选择要复制到的表">
            {tables
              .filter(table => table.id !== currentTableId)
              .map(table => (
                <Option key={table.id} value={table.id}>
                  {table.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TableSelectModal; 