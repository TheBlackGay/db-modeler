import React from 'react';
import { Modal, Form, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { addProject, updateProject } from '../../store/projectsSlice';
import type { Project } from '../../types/models';
import { useSound } from '../../utils/SoundManager';

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
  const { playClick } = useSound();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      playClick();

      if (project) {
        dispatch(
          updateProject({
            ...project,
            ...values,
            updatedAt: new Date().toISOString(),
          })
        );
      } else {
        dispatch(
          addProject({
            ...values,
            id: '',
            tables: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        );
      }

      form.resetFields();
      onCancel();
    } catch (error) {
      console.error('验证失败:', error);
    }
  };

  React.useEffect(() => {
    if (visible && project) {
      form.setFieldsValue(project);
    } else {
      form.resetFields();
    }
  }, [visible, project, form]);

  return (
    <Modal
      title={project ? '编辑项目' : '创建项目'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      afterClose={() => form.resetFields()}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={project || {}}
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
          rules={[{ required: true, message: '请输入项目描述' }]}
        >
          <Input.TextArea
            placeholder="请输入项目描述"
            rows={4}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProjectEditor; 