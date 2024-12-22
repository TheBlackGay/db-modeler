import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Space,
  Table,
  Modal,
  message,
  Divider,
  Typography,
  Tabs,
  Tooltip,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import {
  InterfaceInfo,
  InterfaceStatus,
  HttpMethod,
  ParamInfo,
  ParamType,
  ParamPosition,
} from '../types';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface ParamFormValues extends Omit<ParamInfo, 'id'> {}

const InterfaceEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [paramForm] = Form.useForm();
  const [paramModalVisible, setParamModalVisible] = useState(false);
  const [editingParamType, setEditingParamType] = useState<'request' | 'response'>('request');
  const [requestParams, setRequestParams] = useState<ParamInfo[]>([]);
  const [responseParams, setResponseParams] = useState<ParamInfo[]>([]);
  const [activeTab, setActiveTab] = useState('1');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      // 模拟获取接口详情
      const mockData: InterfaceInfo = {
        id: '1',
        name: '获取用户信息',
        path: '/api/user/info',
        method: HttpMethod.GET,
        status: InterfaceStatus.ONLINE,
        description: '获取当前登录用户的详细信息',
        creator: 'admin',
        createTime: '2024-01-20 10:00:00',
        updateTime: '2024-01-20 10:00:00',
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
        responseParams: [
          {
            id: '1',
            name: 'username',
            type: ParamType.STRING,
            required: true,
            description: '用户名',
          },
        ],
      };

      form.setFieldsValue(mockData);
      setRequestParams(mockData.requestParams);
      setResponseParams(mockData.responseParams);
    }
  }, [id, form]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();
      const interfaceData: Partial<InterfaceInfo> = {
        ...values,
        requestParams,
        responseParams,
      };
      console.log('保存接口数据:', interfaceData);
      message.success('保存成功');
      navigate('/interface/list');
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddParam = (type: 'request' | 'response') => {
    setEditingParamType(type);
    setParamModalVisible(true);
    paramForm.resetFields();
  };

  const handleParamModalOk = async () => {
    try {
      const values: ParamFormValues = await paramForm.validateFields();
      const newParam: ParamInfo = {
        ...values,
        id: Date.now().toString(),
      };

      if (editingParamType === 'request') {
        setRequestParams([...requestParams, newParam]);
      } else {
        setResponseParams([...responseParams, newParam]);
      }

      setParamModalVisible(false);
      paramForm.resetFields();
    } catch (error) {
      console.error('参数表单验证失败:', error);
    }
  };

  const handleDeleteParam = (type: 'request' | 'response', paramId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个参数吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        if (type === 'request') {
          setRequestParams(requestParams.filter(param => param.id !== paramId));
        } else {
          setResponseParams(responseParams.filter(param => param.id !== paramId));
        }
        message.success('删除成功');
      },
    });
  };

  const paramColumns: ColumnsType<ParamInfo> = [
    {
      title: '参数名',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: '15%',
      render: (type: ParamType) => (
        <Tag color="blue">{type}</Tag>
      ),
    },
    {
      title: '是否必填',
      dataIndex: 'required',
      key: 'required',
      width: '10%',
      align: 'center',
      render: (required: boolean) => (
        <Tag color={required ? 'red' : 'default'}>
          {required ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '参数位置',
      dataIndex: 'position',
      key: 'position',
      width: '15%',
      render: (position?: ParamPosition) => 
        position ? <Tag color="purple">{position}</Tag> : '-',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
    },
    {
      title: '操作',
      key: 'action',
      width: '10%',
      render: (_, record) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteParam(editingParamType, record.id)}
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
            <Text strong>{id ? '编辑接口' : '新建接口'}</Text>
          </Space>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="基本信息" key="1">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                status: InterfaceStatus.DRAFT,
                method: HttpMethod.GET,
              }}
            >
              <Form.Item
                name="name"
                label="接口名称"
                rules={[{ required: true, message: '请输入接口名称' }]}
              >
                <Input placeholder="请输入接口名称" />
              </Form.Item>

              <Form.Item
                name="path"
                label={
                  <Space>
                    <span>请求路径</span>
                    <Tooltip title="以 / 开头的完整路径，例如：/api/user/info">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Space>
                }
                rules={[
                  { required: true, message: '请输入请求路径' },
                  { pattern: /^\//, message: '路径必须以 / 开头' },
                ]}
              >
                <Input placeholder="请输入请求路径" />
              </Form.Item>

              <Form.Item
                name="method"
                label="请求方法"
                rules={[{ required: true, message: '请选择请求方法' }]}
              >
                <Select>
                  {Object.values(HttpMethod).map(method => (
                    <Option key={method} value={method}>
                      {method}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select>
                  {Object.values(InterfaceStatus).map(status => (
                    <Option key={status} value={status}>
                      {status === InterfaceStatus.ONLINE ? '已上线' :
                        status === InterfaceStatus.OFFLINE ? '已下线' :
                        status === InterfaceStatus.TESTING ? '测试中' :
                        '草稿'}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="description"
                label="描述"
                rules={[{ required: true, message: '请输入描述' }]}
              >
                <TextArea rows={4} placeholder="请输入描述" />
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="请求参数" key="2">
            <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleAddParam('request')}
              >
                添加参数
              </Button>
            </div>
            <Table<ParamInfo>
              columns={paramColumns}
              dataSource={requestParams}
              rowKey="id"
              pagination={false}
              bordered
            />
          </TabPane>

          <TabPane tab="响应参数" key="3">
            <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleAddParam('response')}
              >
                添加参数
              </Button>
            </div>
            <Table<ParamInfo>
              columns={paramColumns}
              dataSource={responseParams}
              rowKey="id"
              pagination={false}
              bordered
            />
          </TabPane>
        </Tabs>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Space size="large">
            <Button type="primary" loading={saving} onClick={handleSave}>
              保存
            </Button>
            <Button onClick={() => navigate('/interface/list')}>取消</Button>
          </Space>
        </div>
      </Card>

      <Modal
        title={`添加${editingParamType === 'request' ? '请求' : '响应'}参数`}
        open={paramModalVisible}
        onOk={handleParamModalOk}
        onCancel={() => setParamModalVisible(false)}
        width={600}
      >
        <Form form={paramForm} layout="vertical">
          <Form.Item
            name="name"
            label="参数名"
            rules={[{ required: true, message: '请输入参数名' }]}
          >
            <Input placeholder="请输入参数名" />
          </Form.Item>

          <Form.Item
            name="type"
            label="参数类型"
            rules={[{ required: true, message: '请选择参数类型' }]}
          >
            <Select placeholder="请选择参数类型">
              {Object.values(ParamType).map(type => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {editingParamType === 'request' && (
            <Form.Item
              name="position"
              label="参数位置"
              rules={[{ required: true, message: '请选择参数位置' }]}
            >
              <Select placeholder="请选择参数位置">
                {Object.values(ParamPosition).map(position => (
                  <Option key={position} value={position}>
                    {position}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="required"
            label="是否必填"
            valuePropName="checked"
            initialValue={false}
          >
            <Select>
              <Option value={true}>是</Option>
              <Option value={false}>否</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <TextArea rows={4} placeholder="请输入描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InterfaceEdit; 