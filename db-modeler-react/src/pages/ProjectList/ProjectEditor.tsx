import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { addProject, updateProject } from '../../store/projectsSlice';
import type { Project } from '../../types/models';
import { v4 as uuidv4 } from 'uuid';

interface ProjectEditorProps {
  visible: boolean;
  project?: Project | null;
  onCancel: () => void;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({
  visible,
  project,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (visible && project) {
      form.setFieldsValue({
        name: project.name,
        description: project.description,
      });
    } else {
      form.resetFields();
    }
  }, [visible, project, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const now = new Date().toISOString();

      if (project) {
        dispatch(updateProject({
          ...project,
          ...values,
          updatedAt: now,
        }));
      } else {
        dispatch(addProject({
          id: uuidv4(),
          name: values.name,
          description: values.description,
          tables: [],
          createdAt: now,
          updatedAt: now,
        }));
      }

      onCancel();
    } catch (error) {
      console.error('验证失败:', error);
    }
  };

  return (
    <Modal
      title={project ? '编辑项目' : '新建项目'}
      open={visible}
      onOk={handleSave}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
      >
        <Form.Item
          name="name"
          label="项目名称"
          rules={[{ required: true, message: '请输入项目名称' }]}
        >
          <Input placeholder="请输入项目名称" />
        </Form.Item>

        <Form.Item
          name="description"
          label="项目描述"
        >
          <Input.TextArea placeholder="请输入项目描述" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProjectEditor; 