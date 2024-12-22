import React from "react";
import { Layout, Card, Form, Switch, Select, InputNumber, Button, message, Typography } from "antd";
import { SaveOutlined, ReloadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateProject } from "../../store/projectSlice";
import type { RootState } from "../../main";

const { Content } = Layout;
const { Title } = Typography;

interface Settings {
  theme: {
    darkMode: boolean;
    primaryColor: string;
    compactMode: boolean;
  };
  database: {
    connectionTimeout: number;
    maxConnections: number;
    defaultDatabase: string;
    sslEnabled: boolean;
  };
  export: {
    indentStyle: 'space' | 'tab';
    indentSize: number;
    lineEnding: 'lf' | 'crlf';
    upperCase: boolean;
  };
}

const defaultSettings: Settings = {
  theme: {
    darkMode: false,
    primaryColor: '#1890ff',
    compactMode: false,
  },
  database: {
    connectionTimeout: 30,
    maxConnections: 10,
    defaultDatabase: '',
    sslEnabled: true,
  },
  export: {
    indentStyle: 'space',
    indentSize: 2,
    lineEnding: 'lf',
    upperCase: false,
  },
};

export const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const currentProject = useSelector((state: RootState) => state.projects.currentProject);
  const [form] = Form.useForm();

  const handleSave = async () => {
    if (!currentProject) {
      message.error('请先选择一个项目');
      return;
    }

    try {
      const values = await form.validateFields();
      dispatch(
        updateProject({
          ...currentProject,
          settings: values,
          updatedAt: new Date().toISOString(),
        })
      );
      message.success('设置保存成功');
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const handleReset = () => {
    form.setFieldsValue(defaultSettings);
  };

  if (!currentProject) {
    return (
      <Content style={{ padding: '24px' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <Title level={4}>请先选择一个项目</Title>
          </div>
        </Card>
      </Content>
    );
  }

  return (
    <Content style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>项目设置</Title>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              重置
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
            >
              保存
            </Button>
          </Space>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={currentProject.settings || defaultSettings}
        >
          <Title level={5}>主题设置</Title>
          <Form.Item
            name={['theme', 'darkMode']}
            label="深色模式"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name={['theme', 'primaryColor']}
            label="主题色"
          >
            <Select>
              <Select.Option value="#1890ff">默认蓝</Select.Option>
              <Select.Option value="#f5222d">中国红</Select.Option>
              <Select.Option value="#52c41a">极光绿</Select.Option>
              <Select.Option value="#722ed1">酱紫色</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={['theme', 'compactMode']}
            label="紧凑模式"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Title level={5}>数据库设置</Title>
          <Form.Item
            name={['database', 'connectionTimeout']}
            label="连接超时（秒）"
            rules={[{ type: 'number', min: 1, max: 300 }]}
          >
            <InputNumber min={1} max={300} />
          </Form.Item>
          <Form.Item
            name={['database', 'maxConnections']}
            label="最大连接数"
            rules={[{ type: 'number', min: 1, max: 100 }]}
          >
            <InputNumber min={1} max={100} />
          </Form.Item>
          <Form.Item
            name={['database', 'defaultDatabase']}
            label="默认数据库"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={['database', 'sslEnabled']}
            label="启用 SSL"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Title level={5}>导出设置</Title>
          <Form.Item
            name={['export', 'indentStyle']}
            label="缩进风格"
          >
            <Select>
              <Select.Option value="space">空格</Select.Option>
              <Select.Option value="tab">制表符</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={['export', 'indentSize']}
            label="缩进大小"
            rules={[{ type: 'number', min: 1, max: 8 }]}
          >
            <InputNumber min={1} max={8} />
          </Form.Item>
          <Form.Item
            name={['export', 'lineEnding']}
            label="换行符"
          >
            <Select>
              <Select.Option value="lf">LF (Unix)</Select.Option>
              <Select.Option value="crlf">CRLF (Windows)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={['export', 'upperCase']}
            label="SQL 关键字大写"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Card>
    </Content>
  );
}; 