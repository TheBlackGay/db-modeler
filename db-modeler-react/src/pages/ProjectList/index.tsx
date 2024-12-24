import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Table, Space, Card, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { RootState } from '../../store';
import ProjectEditor from './ProjectEditor';
import type { Project } from '../../types/models';

const { Title } = Typography;

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const projects = useSelector((state: RootState) => state.projects.items);
  const loading = useSelector((state: RootState) => state.projects.loading);
  const [editorVisible, setEditorVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    console.log('Current projects:', projects);
  }, [projects]);

  const handleCreate = () => {
    setSelectedProject(null);
    setEditorVisible(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setEditorVisible(true);
  };

  const handleView = (id: string) => {
    navigate(`/project/${id}`);
  };

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Project) => (
        <a onClick={() => handleView(record.id)}>{text}</a>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '表数量',
      key: 'tableCount',
      render: (text: string, record: Project) => record.tables?.length || 0,
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
      render: (text: string, record: Project) => (
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
      <Card>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>项目列表</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建项目
          </Button>
        </div>
        <Table 
          columns={columns} 
          dataSource={projects} 
          rowKey="id" 
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
      <ProjectEditor
        visible={editorVisible}
        project={selectedProject}
        onCancel={() => setEditorVisible(false)}
      />
    </div>
  );
};

export default ProjectList; 