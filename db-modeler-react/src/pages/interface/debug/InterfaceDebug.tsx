import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Space,
  Tabs,
  Typography,
  Table,
  Tag,
  Divider,
  Radio,
  message,
  Tooltip,
} from 'antd';
import {
  SendOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  EnvironmentOutlined,
  CodeOutlined,
  SettingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { InterfaceInfo, HttpMethod, ParamInfo, ParamPosition, ParamType, InterfaceStatus } from '../types';
import type { ColumnsType } from 'antd/es/table';

const { Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

interface RequestParam {
  key: string;
  name: string;
  value: string;
  description?: string;
  enabled: boolean;
}

interface Environment {
  id: string;
  name: string;
  variables: { key: string; value: string }[];
}

const InterfaceDebug: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('params');
  const [requestParams, setRequestParams] = useState<RequestParam[]>([]);
  const [requestHeaders, setRequestHeaders] = useState<RequestParam[]>([]);
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState<{
    status?: number;
    time?: number;
    size?: number;
    data?: any;
    headers?: Record<string, string>;
  }>({});
  const [bodyType, setBodyType] = useState<'none' | 'json' | 'form-data'>('none');
  const [selectedEnv, setSelectedEnv] = useState<string>('');

  // 模拟环境数据
  const environments: Environment[] = [
    {
      id: 'dev',
      name: '开发环境',
      variables: [
        { key: 'baseUrl', value: 'http://dev-api.example.com' },
        { key: 'token', value: 'dev-token' },
      ],
    },
    {
      id: 'prod',
      name: '生产环境',
      variables: [
        { key: 'baseUrl', value: 'http://api.example.com' },
        { key: 'token', value: 'prod-token' },
      ],
    },
  ];

  // 模拟接口数据
  useEffect(() => {
    if (id) {
      const mockData: InterfaceInfo = {
        id: '1',
        name: '获取用户信息',
        path: '/api/user/info',
        method: HttpMethod.GET,
        description: '获取当前登录用户的详细信息',
        requestParams: [
          {
            id: '1',
            name: 'userId',
            type: ParamType.STRING,
            required: true,
            description: '用户ID',
            position: ParamPosition.QUERY,
          },
        ],
        responseParams: [],
        creator: 'admin',
        createTime: '',
        updateTime: '',
        status: InterfaceStatus.ONLINE,
      };

      form.setFieldsValue(mockData);
      
      // 初始化请求参数
      setRequestParams(mockData.requestParams.map(param => ({
        key: param.id,
        name: param.name,
        value: '',
        description: param.description,
        enabled: param.required,
      })));
    }
  }, [id, form]);

  const handleSend = async () => {
    try {
      setLoading(true);
      // 模拟发送请求
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟响应数据
      setResponse({
        status: 200,
        time: 123,
        size: 1024,
        data: {
          code: 0,
          message: 'success',
          data: {
            userId: '123',
            username: 'test',
            email: 'test@example.com',
          },
        },
        headers: {
          'content-type': 'application/json',
          'x-request-id': '123456',
        },
      });

      message.success('请求发送成功');
    } catch (error) {
      message.error('请求发送失败');
    } finally {
      setLoading(false);
    }
  };

  const paramColumns: ColumnsType<RequestParam> = [
    {
      title: '参数名',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: (text, record) => (
        <Input
          value={text}
          onChange={e => {
            const newParams = requestParams.map(param =>
              param.key === record.key ? { ...param, name: e.target.value } : param
            );
            setRequestParams(newParams);
          }}
        />
      ),
    },
    {
      title: '参数值',
      dataIndex: 'value',
      key: 'value',
      width: '30%',
      render: (text, record) => (
        <Input
          value={text}
          onChange={e => {
            const newParams = requestParams.map(param =>
              param.key === record.key ? { ...param, value: e.target.value } : param
            );
            setRequestParams(newParams);
          }}
        />
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
      render: (text, record) => (
        <Input
          value={text}
          onChange={e => {
            const newParams = requestParams.map(param =>
              param.key === record.key ? { ...param, description: e.target.value } : param
            );
            setRequestParams(newParams);
          }}
        />
      ),
    },
    {
      title: '启用',
      dataIndex: 'enabled',
      key: 'enabled',
      width: '10%',
      align: 'center',
      render: (enabled, record) => (
        <Radio
          checked={enabled}
          onChange={e => {
            const newParams = requestParams.map(param =>
              param.key === record.key ? { ...param, enabled: e.target.checked } : param
            );
            setRequestParams(newParams);
          }}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: '10%',
      align: 'center',
      render: (_, record) => (
        <Button
          type="link"
          danger
          onClick={() => {
            setRequestParams(requestParams.filter(param => param.key !== record.key));
          }}
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/interface/list')}
            >
              返回
            </Button>
            <Text strong>接口调试</Text>
          </Space>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <Select
                value={selectedEnv}
                style={{ width: 200 }}
                placeholder="选择环境"
                onChange={value => setSelectedEnv(value)}
              >
                {environments.map(env => (
                  <Option key={env.id} value={env.id}>{env.name}</Option>
                ))}
              </Select>
              <Button icon={<EnvironmentOutlined />}>
                环境管理
              </Button>
            </Space>
            <Space>
              <Button icon={<SaveOutlined />}>
                保存
              </Button>
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={loading}
                onClick={handleSend}
              >
                发送请求
              </Button>
            </Space>
          </Space>
        </div>

        <Input.Group compact style={{ marginBottom: 16 }}>
          <Select
            value={form.getFieldValue('method')}
            style={{ width: '15%' }}
            disabled
          >
            <Option value={HttpMethod.GET}>{HttpMethod.GET}</Option>
            <Option value={HttpMethod.POST}>{HttpMethod.POST}</Option>
            <Option value={HttpMethod.PUT}>{HttpMethod.PUT}</Option>
            <Option value={HttpMethod.DELETE}>{HttpMethod.DELETE}</Option>
          </Select>
          <Input
            style={{ width: '85%' }}
            value={form.getFieldValue('path')}
            disabled
          />
        </Input.Group>

        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Params" key="params">
              <Table<RequestParam>
                columns={paramColumns}
                dataSource={requestParams}
                rowKey="key"
                pagination={false}
                bordered
                footer={() => (
                  <Button
                    type="dashed"
                    block
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setRequestParams([
                        ...requestParams,
                        {
                          key: Date.now().toString(),
                          name: '',
                          value: '',
                          enabled: true,
                        },
                      ]);
                    }}
                  >
                    添加参数
                  </Button>
                )}
              />
            </TabPane>
            <TabPane tab="Headers" key="headers">
              <Table<RequestParam>
                columns={paramColumns}
                dataSource={requestHeaders}
                rowKey="key"
                pagination={false}
                bordered
                footer={() => (
                  <Button
                    type="dashed"
                    block
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setRequestHeaders([
                        ...requestHeaders,
                        {
                          key: Date.now().toString(),
                          name: '',
                          value: '',
                          enabled: true,
                        },
                      ]);
                    }}
                  >
                    添加请求头
                  </Button>
                )}
              />
            </TabPane>
            <TabPane tab="Body" key="body">
              <div style={{ marginBottom: 16 }}>
                <Radio.Group
                  value={bodyType}
                  onChange={e => setBodyType(e.target.value)}
                >
                  <Radio.Button value="none">none</Radio.Button>
                  <Radio.Button value="json">JSON</Radio.Button>
                  <Radio.Button value="form-data">form-data</Radio.Button>
                </Radio.Group>
              </div>
              {bodyType === 'json' && (
                <TextArea
                  rows={10}
                  value={requestBody}
                  onChange={e => setRequestBody(e.target.value)}
                  placeholder="请输入 JSON 格式的请求体"
                />
              )}
            </TabPane>
          </Tabs>
        </Card>

        <Divider>响应结果</Divider>

        <Card>
          {response.status ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <Space split={<Divider type="vertical" />}>
                  <Text>
                    Status: <Tag color={response.status === 200 ? 'success' : 'error'}>
                      {response.status}
                    </Tag>
                  </Text>
                  <Text>Time: {response.time}ms</Text>
                  <Text>Size: {response.size}B</Text>
                </Space>
              </div>
              <Tabs defaultActiveKey="body">
                <TabPane tab="Body" key="body">
                  <div style={{ background: '#f5f5f5', padding: 16 }}>
                    <Paragraph>
                      <pre>{JSON.stringify(response.data, null, 2)}</pre>
                    </Paragraph>
                  </div>
                </TabPane>
                <TabPane tab="Headers" key="headers">
                  <div style={{ background: '#f5f5f5', padding: 16 }}>
                    {Object.entries(response.headers || {}).map(([key, value]) => (
                      <div key={key}>
                        <Text code>{key}: </Text>
                        <Text>{value}</Text>
                      </div>
                    ))}
                  </div>
                </TabPane>
              </Tabs>
            </>
          ) : (
            <Text type="secondary">暂无响应数据</Text>
          )}
        </Card>
      </Card>
    </div>
  );
};

export default InterfaceDebug; 