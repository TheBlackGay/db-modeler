import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Switch } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { StandardField } from '../../types/models';

interface FieldFormProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (field: StandardField) => void;
  field: StandardField | null;
}

const { Option } = Select;

const dataTypes = [
  'varchar',
  'char',
  'text',
  'int',
  'bigint',
  'float',
  'double',
  'decimal',
  'date',
  'datetime',
  'timestamp',
  'boolean',
];

const FieldForm: React.FC<FieldFormProps> = ({
  visible,
  onCancel,
  onSave,
  field,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && field) {
      form.setFieldsValue(field);
    } else {
      form.resetFields();
    }
  }, [visible, field, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const now = new Date().toISOString();
      const savedField: StandardField = {
        id: field?.id || uuidv4(),
        ...values,
        createdAt: field?.createdAt || now,
        updatedAt: now,
      };
      onSave(savedField);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleDataTypeChange = (value: string) => {
    const needsLength = ['varchar', 'char'];
    const needsPrecision = ['decimal', 'float', 'double'];
    
    if (!needsLength.includes(value)) {
      form.setFieldValue('length', undefined);
    }
    if (!needsPrecision.includes(value)) {
      form.setFieldValue('precision', undefined);
      form.setFieldValue('scale', undefined);
    }
  };

  return (
    <Modal
      title={field ? '编辑字段' : '添加字段'}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          required: false,
        }}
      >
        <Form.Item
          name="name"
          label="字段名称"
          rules={[
            { required: true, message: '请输入字段名称' },
            { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: '字段名称只能包含字母、数字和下划线，且必须以字母或下划线开头' },
          ]}
        >
          <Input placeholder="请输入字段名称" />
        </Form.Item>

        <Form.Item
          name="alias"
          label="中文名称"
          rules={[{ required: true, message: '请输入中文名称' }]}
        >
          <Input placeholder="请输入中文名称" />
        </Form.Item>

        <Form.Item
          name="dataType"
          label="数据类型"
          rules={[{ required: true, message: '请选择数据类型' }]}
        >
          <Select placeholder="请选择数据类型" onChange={handleDataTypeChange}>
            {dataTypes.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.dataType !== currentValues.dataType}
        >
          {({ getFieldValue }) => {
            const dataType = getFieldValue('dataType');
            const needsLength = ['varchar', 'char'].includes(dataType);
            const needsPrecision = ['decimal', 'float', 'double'].includes(dataType);

            return (
              <>
                {needsLength && (
                  <Form.Item
                    name="length"
                    label="长度"
                    rules={[{ required: true, message: '请输入长度' }]}
                  >
                    <InputNumber min={1} placeholder="请输入长度" />
                  </Form.Item>
                )}

                {needsPrecision && (
                  <>
                    <Form.Item
                      name="precision"
                      label="精度"
                      rules={[{ required: true, message: '请输入精度' }]}
                    >
                      <InputNumber min={1} placeholder="请输入精度" />
                    </Form.Item>
                    <Form.Item
                      name="scale"
                      label="小数位"
                      rules={[{ required: true, message: '请输入小数位' }]}
                    >
                      <InputNumber min={0} placeholder="请输入小数位" />
                    </Form.Item>
                  </>
                )}
              </>
            );
          }}
        </Form.Item>

        <Form.Item
          name="required"
          label="是否必填"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="defaultValue"
          label="默认值"
        >
          <Input placeholder="请输入默认值" />
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
        >
          <Input.TextArea rows={4} placeholder="请输入字段描述" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FieldForm; 