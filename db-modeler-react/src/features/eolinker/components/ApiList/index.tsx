import React from 'react';
import { Tree, Button, Space, Modal, Form, Input, message, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { 
  PlusOutlined, 
  FolderOutlined, 
  ApiOutlined,
  SearchOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import type { RootState } from '../../../../store';
import { setCurrentApi, setCurrentGroup, setApis, setApiGroups } from '../../../../store/eolinkerSlice';
import type { Api, ApiGroup, HttpMethod } from '../../types/api.types';
import styles from './ApiList.module.scss';

const { Search } = Input;

export const ApiList: React.FC = () => {
  const dispatch = useDispatch();
  const { apiGroups, apis, currentApi, currentGroup } = useSelector((state: RootState) => state.eolinker);
  const [showApiForm, setShowApiForm] = React.useState(false);
  const [showGroupForm, setShowGroupForm] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [apiForm] = Form.useForm();
  const [groupForm] = Form.useForm();

  // 获取请求方法对应的样式类名
  const getMethodClass = (method: HttpMethod) => {
    return method.toLowerCase();
  };

  // 构建树形数据
  const buildTreeData = () => {
    const filteredApis = apis.filter(api => 
      api.name.toLowerCase().includes(searchText.toLowerCase()) ||
      api.path.toLowerCase().includes(searchText.toLowerCase())
    );

    const groupNodes = apiGroups.map(group => {
      const groupApis = filteredApis.filter(api => api.group_id === group.id);
      if (groupApis.length === 0 && searchText) {
        return null;
      }

      return {
        key: `group-${group.id}`,
        title: (
          <Space>
            <span className="name">{group.name}</span>
            <Button 
              type="text" 
              size="small" 
              icon={<MoreOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                // TODO: 显示分组操作菜单
              }}
            />
          </Space>
        ),
        icon: <FolderOutlined />,
        children: groupApis.map(api => ({
          key: `api-${api.id}`,
          title: (
            <Space>
              <span className={`method ${getMethodClass(api.method)}`}>
                {api.method}
              </span>
              <span className="name">{api.name}</span>
              <Button 
                type="text" 
                size="small" 
                icon={<MoreOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: 显示接口操作菜单
                }}
              />
            </Space>
          ),
          icon: <ApiOutlined />,
          isLeaf: true,
        })),
      };
    }).filter(Boolean);

    return groupNodes;
  };

  // 处理树节点选择
  const handleSelect = (selectedKeys: React.Key[]) => {
    const key = selectedKeys[0]?.toString() || '';
    if (key.startsWith('group-')) {
      const groupId = key.replace('group-', '');
      const group = apiGroups.find(g => g.id === groupId);
      dispatch(setCurrentGroup(group || null));
      dispatch(setCurrentApi(null));
    } else if (key.startsWith('api-')) {
      const apiId = key.replace('api-', '');
      const api = apis.find(a => a.id === apiId);
      dispatch(setCurrentApi(api || null));
      dispatch(setCurrentGroup(null));
    }
  };

  // 处理添加接口
  const handleAddApi = async (values: any) => {
    try {
      const newApi: Api = {
        id: Date.now().toString(),
        name: values.name,
        group_id: values.group_id || '',
        method: values.method || 'GET',
        path: values.path || '',
        description: values.description || '',
        url: values.path || '',
        status: 'developing',
        version: '1.0.0',
        tags: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'system',
        updated_by: 'system',
        params: [],
        responses: [],
        mockConfigs: [],
      };
      
      dispatch(setApis([...apis, newApi]));
      message.success('添加接口成功');
      setShowApiForm(false);
      apiForm.resetFields();
    } catch (error) {
      message.error('添加接口失败');
    }
  };

  // 处理添加分组
  const handleAddGroup = async (values: any) => {
    try {
      const newGroup: ApiGroup = {
        id: Date.now().toString(),
        name: values.name,
        description: values.description || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      dispatch(setApiGroups([...apiGroups, newGroup]));
      message.success('添加分组成功');
      setShowGroupForm(false);
      groupForm.resetFields();
    } catch (error) {
      message.error('添加分组失败');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Search
          className={styles.search}
          placeholder="搜索接口"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className={styles.buttons}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowApiForm(true)}
          >
            添加接口
          </Button>
          <Button
            icon={<PlusOutlined />}
            onClick={() => setShowGroupForm(true)}
          >
            添加分组
          </Button>
        </div>
      </div>
      <Tree
        className={styles.tree}
        treeData={buildTreeData()}
        onSelect={handleSelect}
        showIcon
      />

      <Modal
        title="添加接口"
        open={showApiForm}
        onOk={() => apiForm.submit()}
        onCancel={() => setShowApiForm(false)}
      >
        <Form form={apiForm} onFinish={handleAddApi}>
          <Form.Item
            name="name"
            label="接口名称"
            rules={[{ required: true, message: '请输入接口名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="method"
            label="请求方法"
            initialValue="GET"
            rules={[{ required: true, message: '请选择请求方法' }]}
          >
            <Select>
              <Select.Option value="GET">GET</Select.Option>
              <Select.Option value="POST">POST</Select.Option>
              <Select.Option value="PUT">PUT</Select.Option>
              <Select.Option value="DELETE">DELETE</Select.Option>
              <Select.Option value="PATCH">PATCH</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="path"
            label="接口路径"
            rules={[{ required: true, message: '请输入接口路径' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="group_id"
            label="所属分组"
            rules={[{ required: true, message: '请选择所属分组' }]}
          >
            <Select>
              {apiGroups.map(group => (
                <Select.Option key={group.id} value={group.id}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="添加分组"
        open={showGroupForm}
        onOk={() => groupForm.submit()}
        onCancel={() => setShowGroupForm(false)}
      >
        <Form form={groupForm} onFinish={handleAddGroup}>
          <Form.Item
            name="name"
            label="分组名称"
            rules={[{ required: true, message: '请输入分组名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}; 