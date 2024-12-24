import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Table, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { RootState } from '../../store';
import { useTemplates } from '../../features/sql/hooks/useTemplates';
import ApiEditor from './ApiEditor';
import { addApi, updateApi } from '../../store/apiSlice';
import { v4 as uuidv4 } from 'uuid';
import type { Api } from '../../types/models';

export const ApiManager: React.FC = () => {
  const dispatch = useDispatch();
  const apis = useSelector((state: RootState) => state.api.items);
  const { templates } = useTemplates();
  const [editorVisible, setEditorVisible] = useState(false);
  const [selectedApi, setSelectedApi] = useState<Api | null>(null);

  const handleCreate = () => {
    setSelectedApi(null);
    setEditorVisible(true);
  };

  const handleEdit = (api: Api) => {
    setSelectedApi(api);
    setEditorVisible(true);
  };

  const handleSave = (values: Partial<Api>) => {
    const now = new Date().toISOString();
    
    if (selectedApi) {
      // 更新 API
      dispatch(updateApi({
        ...selectedApi,
        ...values,
        updatedAt: now,
      }));
      message.success('API 更新成功');
    } else {
      // 创建新 API
      dispatch(addApi({
        id: uuidv4(),
        name: values.name || '',
        description: values.description || '',
        method: values.method || 'GET',
        path: values.path || '',
        requestParameters: [],
        responseParameters: [],
        createdAt: now,
        updatedAt: now,
      }));
      message.success('API 创建成功');
    }
    
    setEditorVisible(false);
  };

  const columns = [
    {
      title: 'API名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Api) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Button type="primary" onClick={handleCreate}>
          新建API
        </Button>
      </div>
      <Table columns={columns} dataSource={apis} rowKey="id" />
      <ApiEditor
        visible={editorVisible}
        api={selectedApi}
        onCancel={() => setEditorVisible(false)}
        onSave={handleSave}
        templates={templates}
      />
    </div>
  );
}; 