import React, { useEffect, useMemo } from 'react';
import { Modal, Form, Input, Select, InputNumber, Switch, Space, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { Field } from '../../types/models';
import { fieldTypes } from '../../types';

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
        precision: values.precision ? Number(values.precision) : undefined,
        scale: values.scale ? Number(values.scale) : undefined,
      });
    });
  };

  const selectedType = Form.useWatch('type', form);

  const showLengthField = useMemo(() => {
    return ['varchar', 'char', 'int', 'bigint', 'decimal'].includes(selectedType?.toLowerCase() || '');
  }, [selectedType]);

  const showPrecisionScale = useMemo(() => {
    return ['decimal', 'numeric', 'float', 'double'].includes(selectedType?.toLowerCase() || '');
  }, [selectedType]);

  const showUnsigned = useMemo(() => {
    return ['int', 'bigint', 'tinyint', 'smallint', 'decimal', 'float', 'double'].includes(selectedType?.toLowerCase() || '');
  }, [selectedType]);

  return (
    <Modal
      title={initialValues ? '编辑字段' : '添加字段'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={640}
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
          rules={[
            { required: true, message: '请输入字段名' },
            { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: '字段名只能包含字母、数字和下划线，且必须以字母或下划线开头' }
          ]}
        >
          <Input placeholder="请输入字段名" />
        </Form.Item>

        <Form.Item
          label="类型"
          name="type"
          rules={[{ required: true, message: '请选择字段类型' }]}
        >
          <Select>
            {fieldTypes.map(type => (
              <Select.Option key={type.value} value={type.value}>
                <Space>
                  {type.label}
                  <Tooltip title={type.description}>
                    <InfoCircleOutlined />
                  </Tooltip>
                </Space>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {showLengthField && (
          <Form.Item
            label="长度"
            name="length"
            rules={[{ type: 'number', min: 1, message: '长度必须大于0' }]}
          >
            <InputNumber min={1} placeholder="请输入字段长度" />
          </Form.Item>
        )}

        {showPrecisionScale && (
          <Space>
            <Form.Item
              label="精度"
              name="precision"
              rules={[{ type: 'number', min: 1, message: '精度必须大于0' }]}
            >
              <InputNumber min={1} placeholder="总位数" />
            </Form.Item>

            <Form.Item
              label="小数位"
              name="scale"
              rules={[{ type: 'number', min: 0, message: '小数位必须大于等于0' }]}
            >
              <InputNumber min={0} placeholder="小数位数" />
            </Form.Item>
          </Space>
        )}

        <Form.Item
          label="允许为空"
          name="nullable"
          valuePropName="checked"
          tooltip="字段是否可以为 NULL"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="默认值"
          name="defaultValue"
          tooltip="设置字段的默认值"
        >
          <Input placeholder="请输入默认值" />
        </Form.Item>

        <Form.Item
          label="注释"
          name="comment"
          tooltip="字段的描述信息"
        >
          <Input.TextArea rows={2} placeholder="请输入字段注释" />
        </Form.Item>

        <Form.Item
          label="主键"
          name="isPrimaryKey"
          valuePropName="checked"
          tooltip="是否作为表的主键"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="自增"
          name="isAutoIncrement"
          valuePropName="checked"
          tooltip="是否自动递增（仅适用于整数类型的主键）"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="唯一"
          name="unique"
          valuePropName="checked"
          tooltip="是否要求字段值唯一"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="索引"
          name="index"
          valuePropName="checked"
          tooltip="是否创建索引"
        >
          <Switch />
        </Form.Item>

        {showUnsigned && (
          <Form.Item
            label="无符号"
            name="unsigned"
            valuePropName="checked"
            tooltip="是否为无符号数（仅适用于数字类型）"
          >
            <Switch />
          </Form.Item>
        )}

        {showUnsigned && (
          <Form.Item
            label="补零"
            name="zerofill"
            valuePropName="checked"
            tooltip="是否用零填充（仅适用于整数类型）"
          >
            <Switch />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default FieldForm; 