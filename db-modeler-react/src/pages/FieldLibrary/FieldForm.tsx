import React from 'react';
import { Modal, Form, Input, Select, Switch, InputNumber } from 'antd';
import { StandardField, StandardFieldCategory } from '../../types/models';

interface FieldFormProps {
  field: StandardField | null;
  visible: boolean;
  onClose: () => void;
  categories: StandardFieldCategory[];
}

const { Option } = Select;
const { TextArea } = Input;

const FieldForm: React.FC<FieldFormProps> = ({
  field,
  visible,
  onClose,
  categories,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // TODO: 处理表单提交
      onClose();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={field ? '编辑字段' : '添加字段'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      width={720}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={field || {
          required: false,
          tags: [],
        }}
      >
        <Form.Item
          name="name"
          label="字段名称（英文）"
          rules={[
            { required: true, message: '请输入字段名称' },
            { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '字段名称只能包含字母、数字和下划线，且必须以字母开头' },
          ]}
        >
          <Input placeholder="例如：user_name" />
        </Form.Item>

        <Form.Item
          name="alias"
          label="中文名称"
          rules={[{ required: true, message: '请输入中文名称' }]}
        >
          <Input placeholder="例如：用户名" />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="所属分类"
          rules={[{ required: true, message: '请选择所属分类' }]}
        >
          <Select placeholder="请选择分类">
            {categories.map(category => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="dataType"
          label="数据类型"
          rules={[{ required: true, message: '请选择数据类型' }]}
        >
          <Select placeholder="请选择数据类型">
            <Option value="varchar">VARCHAR</Option>
            <Option value="int">INT</Option>
            <Option value="decimal">DECIMAL</Option>
            <Option value="datetime">DATETIME</Option>
            <Option value="text">TEXT</Option>
            <Option value="boolean">BOOLEAN</Option>
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.dataType !== currentValues.dataType
          }
        >
          {({ getFieldValue }) => {
            const dataType = getFieldValue('dataType');
            if (dataType === 'varchar') {
              return (
                <Form.Item
                  name="length"
                  label="长度"
                  rules={[{ required: true, message: '请输入长度' }]}
                >
                  <InputNumber min={1} max={65535} />
                </Form.Item>
              );
            }
            if (dataType === 'decimal') {
              return (
                <>
                  <Form.Item
                    name="precision"
                    label="精度"
                    rules={[{ required: true, message: '请输入精度' }]}
                  >
                    <InputNumber min={1} max={65} />
                  </Form.Item>
                  <Form.Item
                    name="scale"
                    label="小数位"
                    rules={[{ required: true, message: '请输入小数位数' }]}
                  >
                    <InputNumber min={0} max={30} />
                  </Form.Item>
                </>
              );
            }
            return null;
          }}
        </Form.Item>

        <Form.Item name="required" valuePropName="checked" label="是否必填">
          <Switch />
        </Form.Item>

        <Form.Item name="defaultValue" label="默认值">
          <Input placeholder="请输入默认值" />
        </Form.Item>

        <Form.Item name="description" label="描述">
          <TextArea rows={4} placeholder="请输入字段描述" />
        </Form.Item>

        <Form.Item name="tags" label="标签">
          <Select mode="tags" placeholder="请输入标签">
            <Option value="system">系统字段</Option>
            <Option value="business">业务字段</Option>
            <Option value="audit">审计字段</Option>
          </Select>
        </Form.Item>

        <Form.Item name="examples" label="示例值">
          <Select mode="tags" placeholder="请输入示例值" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FieldForm; 