import React from 'react';
import { Card, Form, Switch, Select, InputNumber, Radio, Space, Button, message } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { useOutletContext } from 'react-router-dom';
import type { IProject, IProjectSettings } from '../../data/mockData';
import { storage } from '../../utils/storage';

interface ProjectContextType {
  project: IProject;
  setProject: React.Dispatch<React.SetStateAction<IProject | null>>;
}

const colorOptions = [
  { label: '默认蓝', value: '#1890ff' },
  { label: '拂晓蓝', value: '#1677ff' },
  { label: '薄暮红', value: '#f5222d' },
  { label: '火山橙', value: '#fa541c' },
  { label: '日暮黄', value: '#faad14' },
  { label: '极光绿', value: '#52c41a' },
  { label: '明青色', value: '#13c2c2' },
  { label: '酱紫色', value: '#722ed1' },
];

const databaseOptions = [
  { label: 'MySQL', value: 'mysql' },
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'SQL Server', value: 'sqlserver' },
  { label: 'Oracle', value: 'oracle' },
];

const defaultSettings: IProjectSettings = {
  theme: {
    darkMode: false,
    primaryColor: '#1890ff',
    compactMode: false,
  },
  database: {
    connectionTimeout: 30,
    maxConnections: 10,
    defaultDatabase: 'mysql',
    sslEnabled: true,
  },
  export: {
    indentStyle: 'space',
    indentSize: 2,
    lineEnding: 'lf',
    upperCase: false,
  },
};

const SystemSettings: React.FC = () => {
  const { project, setProject } = useOutletContext<ProjectContextType>();
  const [form] = Form.useForm();

  // 保存设置
  const handleSave = () => {
    form.validateFields().then(values => {
      const updatedProject = {
        ...project,
        settings: values,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setProject(updatedProject);
      storage.updateProject(updatedProject);

      // 应用主题设置
      document.documentElement.classList.toggle('dark', values.theme.darkMode);
      document.documentElement.style.setProperty('--primary-color', values.theme.primaryColor);
      document.documentElement.classList.toggle('compact', values.theme.compactMode);

      message.success('设置保存成功');
    });
  };

  // 重置设置
  const handleReset = () => {
    const updatedProject = {
      ...project,
      settings: defaultSettings,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setProject(updatedProject);
    storage.updateProject(updatedProject);
    form.setFieldsValue(defaultSettings);

    // 应用默认主题设置
    document.documentElement.classList.toggle('dark', defaultSettings.theme.darkMode);
    document.documentElement.style.setProperty('--primary-color', defaultSettings.theme.primaryColor);
    document.documentElement.classList.toggle('compact', defaultSettings.theme.compactMode);

    message.success('设置已重置为默认值');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold m-0">项目设置</h2>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleReset}
          >
            重置默认
          </Button>
          <Button 
            type="primary" 
            icon={<SaveOutlined />}
            onClick={handleSave}
          >
            保存设置
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={project.settings}
      >
        <Card title="主题设置" className="mb-6">
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
            <Radio.Group 
              optionType="button" 
              buttonStyle="solid"
              options={colorOptions}
            />
          </Form.Item>

          <Form.Item
            name={['theme', 'compactMode']}
            label="紧凑模式"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Card>

        <Card title="数据库设置" className="mb-6">
          <Form.Item
            name={['database', 'defaultDatabase']}
            label="默认数据库类型"
          >
            <Select options={databaseOptions} />
          </Form.Item>

          <Form.Item
            name={['database', 'connectionTimeout']}
            label="连接超时时间（秒）"
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
            name={['database', 'sslEnabled']}
            label="启用 SSL 连接"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Card>

        <Card title="导出设置">
          <Form.Item
            name={['export', 'indentStyle']}
            label="缩进风格"
          >
            <Radio.Group>
              <Radio.Button value="space">空格</Radio.Button>
              <Radio.Button value="tab">Tab</Radio.Button>
            </Radio.Group>
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
            <Radio.Group>
              <Radio.Button value="lf">LF</Radio.Button>
              <Radio.Button value="crlf">CRLF</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name={['export', 'upperCase']}
            label="SQL 关键字大写"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Card>
      </Form>
    </div>
  );
};

export default SystemSettings; 