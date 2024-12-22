import React from 'react';
import { Modal, Form, Input, Select, TreeSelect, InputNumber, Switch } from 'antd';
import type { ApiParamFormProps, ParamType, ParamIn } from '../../types/api.types';
import styles from './ApiParamForm.module.scss';

const { Option } = Select;
const { TextArea } = Input;

const ApiParamForm: React.FC<ApiParamFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  parentParams,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({
        ...values,
        rules: {
          required: values.required || false,
          minLength: values.minLength,
          maxLength: values.maxLength,
          pattern: values.pattern,
          minimum: values.minimum,
          maximum: values.maximum,
          enum: values.enumValues?.split('\n').filter(Boolean) || [],
          description: values.ruleDescription,
        },
      });
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const paramTypes: ParamType[] = [
    'string',
    'number',
    'boolean',
    'object',
    'array',
    'file',
    'enum',
  ];

  const paramLocations: ParamIn[] = [
    'query',
    'header',
    'path',
    'body',
    'formData',
  ];

  return (
    <Modal
      title={initialValues ? '编辑参数' : '添加参数'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      destroyOnClose
      width={720}
      className={styles.apiParamFormModal}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...initialValues,
          required: initialValues?.rules?.required,
          minLength: initialValues?.rules?.minLength,
          maxLength: initialValues?.rules?.maxLength,
          pattern: initialValues?.rules?.pattern,
          minimum: initialValues?.rules?.minimum,
          maximum: initialValues?.rules?.maximum,
          enumValues: initialValues?.rules?.enum?.join('\n'),
          ruleDescription: initialValues?.rules?.description,
        }}
        className={styles.apiParamForm}
      >
        <Form.Item
          name="name"
          label="参数名称"
          rules={[{ required: true, message: '请输入参数名称' }]}
        >
          <Input placeholder="请输入参数名称" />
        </Form.Item>

        <Form.Item
          name="type"
          label="参数类型"
          rules={[{ required: true, message: '请选择参数类型' }]}
        >
          <Select placeholder="请选择参数类型">
            {paramTypes.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="param_in"
          label="参数位置"
          rules={[{ required: true, message: '请选择参数位置' }]}
        >
          <Select placeholder="请选择参数位置">
            {paramLocations.map(location => (
              <Option key={location} value={location}>{location}</Option>
            ))}
          </Select>
        </Form.Item>

        {parentParams && (
          <Form.Item
            name="parent_id"
            label="父参数"
          >
            <TreeSelect
              placeholder="请选择父参数"
              treeData={parentParams.map(param => ({
                title: param.name,
                value: param.id,
                key: param.id,
              }))}
            />
          </Form.Item>
        )}

        <Form.Item
          name="description"
          label="参数描述"
        >
          <TextArea rows={2} placeholder="请输入参数描述" />
        </Form.Item>

        <Form.Item
          name="example"
          label="示例值"
        >
          <Input placeholder="请输入示例值" />
        </Form.Item>

        <Form.Item
          name="default_value"
          label="默认值"
        >
          <Input placeholder="请输入默认值" />
        </Form.Item>

        <div className={styles.validationRules}>
          <h3>验证规则</h3>

          <Form.Item
            name="required"
            valuePropName="checked"
            label="是否必填"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="minLength"
            label="最小长度"
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            name="maxLength"
            label="最大长度"
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            name="pattern"
            label="正则表达式"
          >
            <Input placeholder="请输入正则表达式" />
          </Form.Item>

          <Form.Item
            name="minimum"
            label="最小值"
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            name="maximum"
            label="最大值"
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            name="enumValues"
            label="枚举值"
            help="每行一个值"
          >
            <TextArea rows={4} placeholder="请输入枚举值，每行一个" />
          </Form.Item>

          <Form.Item
            name="ruleDescription"
            label="规则说明"
          >
            <TextArea rows={2} placeholder="请输入规则说明" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ApiParamForm; 