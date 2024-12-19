import React, { useState, useEffect } from 'react';
import { Card, List, Button, Space, Modal, Form, Input, message, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addProject, updateProject, deleteProject, setProjects } from '../../store/projectsSlice';
import { type IProject } from '../../data/mockData';
import { loadProjects } from '../../utils/storage';
import { v4 as uuidv4 } from 'uuid';

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<IProject | null>(null);
  const [form] = Form.useForm();

  const projects = useSelector((state: RootState) => state.projects.items);

  // 加载项目数据
  useEffect(() => {
    const storedProjects = loadProjects();
    dispatch(setProjects(storedProjects));
  }, [dispatch]);

  // 处理添加/编辑项目
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const now = new Date().toISOString();
      
      if (editingProject) {
        // 编辑现有项目
        const updatedProject = {
          ...editingProject,
          ...values,
          updatedAt: now
        };
        dispatch(updateProject(updatedProject));
        message.success('项目编辑成功');
      } else {
        // 创建新项目
        const newProject: IProject = {
          id: uuidv4(),
          ...values,
          createdAt: now,
          updatedAt: now,
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
          }
        };
        dispatch(addProject(newProject));
        message.success('项目创建成功');
        // 创建成功后导航到项目详情页
        navigate(`/project/${newProject.id}`);
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingProject(null);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 处理编辑
  const handleEdit = (project: IProject) => {
    setEditingProject(project);
    form.setFieldsValue({
      name: project.name,
      description: project.description,
    });
    setIsModalVisible(true);
  };

  // 处理删除
  const handleDelete = (project: IProject) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除项目 "${project.name}" 吗？此操作不可恢复。`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch(deleteProject(project.id));
        message.success('删除成功');
      },
    });
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const renderProjectForm = () => (
    <Form
      form={form}
      layout="vertical"
      preserve={false}
      initialValues={editingProject ? {
        name: editingProject.name,
        description: editingProject.description,
      } : undefined}
    >
      <Form.Item
        name="name"
        label="项目名称"
        rules={[
          { required: true, message: '请输入项目名称' },
          { max: 50, message: '项目名称不能超过50个字符' }
        ]}
      >
        <Input placeholder="例如：我的项目" />
      </Form.Item>
      <Form.Item
        name="description"
        label="项目描述"
        rules={[
          { max: 200, message: '项目描述不能超过200个字符' }
        ]}
      >
        <Input.TextArea 
          rows={4} 
          placeholder="请输入项目的描述信息"
          showCount
          maxLength={200}
        />
      </Form.Item>
    </Form>
  );

  if (!projects.length) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold m-0">数据库设计项目</h2>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreateProject}
          >
            新建项目
          </Button>
        </div>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无项目"
        >
          <Button 
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateProject}
          >
            立即创建
          </Button>
        </Empty>

        <Modal
          title="新建项目"
          open={isModalVisible}
          onOk={handleSubmit}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setEditingProject(null);
          }}
          destroyOnClose
        >
          {renderProjectForm()}
        </Modal>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold m-0">数据库设计项目</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleCreateProject}
        >
          新建项目
        </Button>
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
        dataSource={projects}
        renderItem={project => (
          <List.Item>
            <Card
              hoverable
              onClick={() => navigate(`/project/${project.id}`)}
              actions={[
                <Button 
                  type="text" 
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(project);
                  }}
                >
                  编辑
                </Button>,
                <Button 
                  type="text" 
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(project);
                  }}
                >
                  删除
                </Button>
              ]}
            >
              <Card.Meta
                title={project.name}
                description={
                  <Space direction="vertical" size={2}>
                    {project.description && (
                      <div className="text-gray-500">{project.description}</div>
                    )}
                    <div className="text-gray-400">
                      {project.tables.length} 张表
                    </div>
                    <div className="text-gray-400 text-xs">
                      更新于 {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                  </Space>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title={`${editingProject ? '编辑' : '新建'}项目`}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingProject(null);
        }}
        destroyOnClose
      >
        {renderProjectForm()}
      </Modal>
    </div>
  );
};

export default ProjectList; 