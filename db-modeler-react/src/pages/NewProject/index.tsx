import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addProject } from '../../store/projectSlice';
import styles from './NewProject.module.scss';

export const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      const now = new Date().toISOString();
      const newProject = {
        id: uuidv4(),
        ...values,
        tables: [],
        connections: [],
        createdAt: now,
        updatedAt: now,
      };

      dispatch(addProject(newProject));
      message.success('项目创建成功');
      navigate(`/project/${newProject.id}`);
    } catch (error) {
      message.error('创建项目失败');
      console.error('Failed to create project:', error);
    }
  };

  return (
    <div className={styles.newProject}>
      <Card title="创建新项目" className={styles.card}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
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
            <Input.TextArea
              placeholder="请输入项目描述"
              rows={4}
            />
          </Form.Item>

          <Form.Item>
            <div className={styles.buttons}>
              <Button onClick={() => navigate('/')}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                创建
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}; 