import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import type { Api, FieldTemplate } from '../../types/models';

interface ApiEditorProps {
  visible: boolean;
  api: Api | null;
  onCancel: () => void;
  onSave: (values: Partial<Api>) => void;
  templates: FieldTemplate[];
}

const ApiEditor: React.FC<ApiEditorProps> = ({
  visible,
  api,
  onCancel,
  onSave,
  templates,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible && api) {
      form.setFieldsValue(api);
    } else {
      form.resetFields();
    }
  }, [visible, api, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSave(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={api ? '编辑 API' : '新建 API'}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          method: 'GET',
          requestParameters: {
            query: [],
            body: {
              type: 'object',
              properties: {},
            },
          },
          responseParameters: {
            type: 'object',
            properties: {},
          },
        }}
      >
        <Form.Item
          name="name"
          label="API 名称"
          rules={[{ required: true, message: '请输入 API 名称' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="method"
          label="请求方法"
          rules={[{ required: true, message: '请选择请求方法' }]}
        >
          <Select>
            <Select.Option value="GET">GET</Select.Option>
            <Select.Option value="POST">POST</Select.Option>
            <Select.Option value="PUT">PUT</Select.Option>
            <Select.Option value="DELETE">DELETE</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="path"
          label="路径"
          rules={[{ required: true, message: '请输入路径' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ApiEditor; 