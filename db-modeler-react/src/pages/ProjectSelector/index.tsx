import React, { useState } from 'react';
import { Card, List, Button, Space, Modal, Form, Input, Empty, Typography, Tag, Tooltip, message } from 'antd';
import { 
  PlusOutlined, 
  ProjectOutlined, 
  DatabaseOutlined,
  TableOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  ImportOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { 
  setCurrentProject, 
  deleteProject, 
  updateProject,
  addProject,
  importProject 
} from '../../store/projectsSlice';
import type { IProject } from '../../data/mockData';
import { v4 as uuidv4 } from 'uuid';

const { Title, Text } = Typography;

const ProjectSelector: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector((state: RootState) => state.projects.items);
  const loading = useSelector((state: RootState) => state.projects.loading);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<IProject | null>(null);
  const [form] = Form.useForm();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Card loading={true} />
        </div>
        <List
          grid={{ 
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={[1, 2, 3, 4]}
          renderItem={() => (
            <List.Item>
              <Card loading={true} />
            </List.Item>
          )}
        />
      </div>
    );
  }

  // 处理创建/编辑项目
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const now = new Date().toISOString().split('T')[0];
      
      if (editingProject) {
        // 编辑现有项目
        const updatedProject = {
          ...editingProject,
          ...values,
          updatedAt: now,
        };
        dispatch(updateProject({ id: editingProject.id, data: updatedProject }));
        message.success('项目编辑成功');
      } else {
        // 创建新项目
        const newProject: IProject = {
          id: uuidv4(),
          ...values,
          tables: [],
          connections: [],
          settings: {
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
          },
          createdAt: now,
          updatedAt: now,
        };
        dispatch(addProject(newProject));
        message.success('项目创建成功');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setEditingProject(null);
    });
  };

  // 处理删除项目
  const handleDelete = (project: IProject) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除项目 "${project.name}" 吗？此操作将删除项目的所有数据且不可恢复。`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch(deleteProject(project.id));
        message.success('项目删除成功');
      },
    });
  };

  // 处理导出项目
  const handleExport = (project: IProject) => {
    const dataStr = JSON.stringify(project, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name}-${project.updatedAt}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 处理导入项目
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const project = JSON.parse(e.target?.result as string);
            // 验证项目数据结构
            if (!project.name || !project.tables) {
              throw new Error('无效的项目文件');
            }
            // 生成新的ID避免冲突
            project.id = uuidv4();
            dispatch(importProject(project));
            message.success('项目导入成功');
          } catch (error) {
            message.error('项目导入失败：无效的项目文件');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleProjectClick = (project: IProject) => {
    dispatch(setCurrentProject(project.id));
    // 等待一下状态更新
    setTimeout(() => {
      navigate(`/project/${project.id}`);
    }, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="m-0">项目管理</Title>
        <Space>
          <Button 
            icon={<ImportOutlined />}
            onClick={handleImport}
          >
            导入项目
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingProject(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            新建项目
          </Button>
        </Space>
      </div>

      {projects.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Space direction="vertical" align="center">
              <span>暂无项目</span>
              <span className="text-gray-400">创建或导入一个项目开始使用</span>
            </Space>
          }
        >
          <Button 
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingProject(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            立即创建
          </Button>
        </Empty>
      ) : (
        <List
          grid={{ 
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={projects}
          renderItem={project => (
            <List.Item>
              <Card
                hoverable
                className="h-full"
                onClick={(e) => {
                  // 防止事件冒泡，避免触发操作按钮的点击事件
                  if ((e.target as HTMLElement).closest('.ant-card-actions')) {
                    return;
                  }
                  handleProjectClick(project);
                }}
                actions={[
                  <Tooltip title="编辑项目">
                    <EditOutlined key="edit" onClick={(e) => {
                      e.stopPropagation();
                      setEditingProject(project);
                      form.setFieldsValue(project);
                      setIsModalVisible(true);
                    }} />
                  </Tooltip>,
                  <Tooltip title="导出项目">
                    <ExportOutlined key="export" onClick={(e) => {
                      e.stopPropagation();
                      handleExport(project);
                    }} />
                  </Tooltip>,
                  <Tooltip title="删除项目">
                    <DeleteOutlined 
                      key="delete" 
                      className="text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project);
                      }} 
                    />
                  </Tooltip>,
                ]}
              >
                <Card.Meta
                  avatar={<ProjectOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                  title={project.name}
                  description={
                    <Space direction="vertical" size={2}>
                      {project.description && (
                        <Text type="secondary" ellipsis={{ tooltip: project.description }}>
                          {project.description}
                        </Text>
                      )}
                      <Space size={[0, 4]} wrap>
                        <Tag icon={<TableOutlined />} color="blue">
                          {project.tables.length} 张表
                        </Tag>
                        <Tag icon={<DatabaseOutlined />} color="green">
                          {project.connections.length} 个连接
                        </Tag>
                        <Tag icon={<SettingOutlined />} color="orange">
                          已配置
                        </Tag>
                      </Space>
                      <Text type="secondary" className="text-xs">
                        更新于 {project.updatedAt}
                      </Text>
                    </Space>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      )}

      <Modal
        title={`${editingProject ? '编辑' : '新建'}项目`}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingProject(null);
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="项目名称"
            rules={[
              { required: true, message: '请输入项目名称' },
              { max: 50, message: '项目名称不能超过50个字符' }
            ]}
          >
            <Input placeholder="请输入项目名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="项目描述"
            rules={[
              { max: 200, message: '项目描述不能超过200个字符' }
            ]}
          >
            <Input.TextArea 
              placeholder="请输入项目描述" 
              rows={4}
              showCount
              maxLength={200}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectSelector; 