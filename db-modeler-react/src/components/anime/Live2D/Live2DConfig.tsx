import React, { useState } from 'react';
import { Button, Modal, Form, Select, InputNumber, Space } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const ConfigButton = styled(Button)`
  margin-right: 16px;
`;

interface Live2DSettings {
  position: 'right' | 'left';
  size: number;
  model: string;
}

interface Live2DConfigProps {
  settings: Live2DSettings;
  onSettingsChange: (settings: Partial<Live2DSettings>) => void;
}

const Live2DConfig: React.FC<Live2DConfigProps> = ({
  settings,
  onSettingsChange,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    form.setFieldsValue(settings);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSettingsChange(values);
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <ConfigButton 
        type="text" 
        icon={<SettingOutlined />} 
        onClick={showModal}
      >
        看板娘设置
      </ConfigButton>

      <Modal
        title="看板娘设置"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={settings}
        >
          <Form.Item
            name="position"
            label="位置"
          >
            <Select>
              <Select.Option value="left">左侧</Select.Option>
              <Select.Option value="right">右侧</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="size"
            label="大小"
          >
            <InputNumber min={100} max={500} />
          </Form.Item>

          <Form.Item
            name="model"
            label="模型"
          >
            <Select>
              <Select.Option value="shizuku">Shizuku</Select.Option>
              <Select.Option value="miku">Miku</Select.Option>
              <Select.Option value="epsilon">Epsilon</Select.Option>
              <Select.Option value="haru">Haru</Select.Option>
              <Select.Option value="chitose">Chitose</Select.Option>
              <Select.Option value="rem">Rem</Select.Option>
              <Select.Option value="asuna">Asuna</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Live2DConfig; 