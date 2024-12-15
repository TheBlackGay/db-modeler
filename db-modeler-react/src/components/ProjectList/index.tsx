import React, { useState, useRef } from 'react';
import { List, Card, Button, Dropdown, Modal, Form, Input, message, Upload } from 'antd';
import { EllipsisOutlined, PlusOutlined, UploadOutlined, EditOutlined, ExportOutlined, DeleteOutlined } from '@ant-design/icons';
import type { MenuProps, UploadProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addProject, deleteProject, updateProject, importProject, setCurrentProject } from '../../store/projectsSlice';
import { exportProject, importProject as importProjectFile } from '../../services/storage';
import type { Project } from '../../types/models';

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector((state: RootState) => state.projects.items);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form] = Form.useForm();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProjectClick = (project: Project) => {
    dispatch(setCurrentProject(project.id));
    navigate(`/project/${project.id}`);
  };

  const handleAddProject = () => {
    setEditingProject(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    form.resetFields();
    form.setFieldsValue({
      name: project.name,
      description: project.description,
    });
    setIsModalVisible(true);
  };

  const handleDeleteProject = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个项目吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch(deleteProject(id));
        message.success('项目删除成功');
      },
    });
  };

  const handleExportProject = (project: Project) => {
    try {
      exportProject(project);
      message.success('项目导出成功');
    } catch (error) {
      message.error('项目导出失败');
    }
  };

  const handleImportProject = async (file: File) => {
    try {
      const project = await importProjectFile(file);
      dispatch(importProject(project));
      message.success('项目导入成功');
    } catch (error) {
      message.error('项目导入失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // 检查项目名称是否重复
      const isDuplicate = projects.some(
        project => project.name === values.name && project.id !== editingProject?.id
      );

      if (isDuplicate) {
        message.error('项目名称已存在，请使用其他名称');
        return;
      }

      if (editingProject) {
        // 更新项目
        dispatch(updateProject({
          id: editingProject.id,
          data: values,
        }));
        message.success('项目更新成功');
      } else {
        // 创建项目
        dispatch(addProject(values));
        message.success('项目创建成功');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingProject(null);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const getDropdownItems = (project: Project): MenuProps['items'] => [
    {
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined />,
      onClick: () => setTimeout(() => handleEditProject(project), 0),
    },
    {
      key: 'export',
      label: '导出',
      icon: <ExportOutlined />,
      onClick: () => setTimeout(() => handleExportProject(project), 0),
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => setTimeout(() => handleDeleteProject(project.id), 0),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">我的项目</h2>
        <div className="space-x-4">
          <Button
            onClick={() => fileInputRef.current?.click()}
            icon={<UploadOutlined />}
          >
            导入项目
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImportProject(file);
                e.target.value = '';
              }
            }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProject}>
            新建项目
          </Button>
        </div>
      </div>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={projects}
        renderItem={(item: Project) => (
          <List.Item>
            <Card
              hoverable
              title={item.name}
              extra={
                <Dropdown 
                  menu={{ 
                    items: getDropdownItems(item),
                    onClick: e => {
                      e.domEvent.stopPropagation();
                      e.domEvent.preventDefault();
                    }
                  }} 
                  placement="bottomRight"
                  trigger={['click']}
                  destroyPopupOnHide
                >
                  <Button 
                    type="text" 
                    icon={<EllipsisOutlined />}
                    onClick={e => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  />
                </Dropdown>
              }
              onClick={() => handleProjectClick(item)}
            >
              <p className="text-gray-600">{item.description}</p>
              <p className="text-sm text-gray-400 mt-4">
                最后更新：{new Date(item.updatedAt).toLocaleString()}
              </p>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title={editingProject ? '编辑项目' : '新建项目'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingProject(null);
          form.resetFields();
        }}
        destroyOnClose
      >
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
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input placeholder="例如：我的项目" />
          </Form.Item>
          <Form.Item
            name="description"
            label="项目描述"
            rules={[{ required: true, message: '请输入项目描述' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入项目的描述信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectList; 