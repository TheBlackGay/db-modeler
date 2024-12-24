import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, Spin, Result, Button, Space, Modal, Form, Input, message } from 'antd';
import type { RootState } from '../../store';
import type { Project, Table } from '../../types/models';
import { loadProjects, setCurrentProject } from '../../store/projectsSlice';
import TableEditor from './TableEditor';
import ERDiagram from './ERDiagram';
import { generateId } from '../../utils/helpers';

const PROJECTS_STORAGE_KEY = 'db_modeler_projects';

const loadProjectsFromStorage = (): Project[] => {
  try {
    const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
    console.log('从 localStorage 加载的项目数据:', storedProjects);
    return storedProjects ? JSON.parse(storedProjects) : [];
  } catch (error) {
    console.error('加载项目失败:', error);
    return [];
  }
};

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTableForm, setShowTableForm] = useState(false);

  // 从 Redux store 获取项目数据
  const project = useSelector((state: RootState) =>
    state.projects.items.find((p) => p.id === id)
  );

  const handleCreateTable = () => {
    setShowTableForm(true);
  };

  const handleTableFormSubmit = (values: any) => {
    if (!project || !id) return;

    const now = new Date().toISOString();
    const newTable: Table = {
      id: generateId(),
      name: values.name,
      description: values.description || '',
      fields: [],
      createdAt: now,
      updatedAt: now,
    };

    const updatedProject = {
      ...project,
      tables: [...project.tables, newTable],
      updatedAt: now,
    };

    dispatch(setCurrentProject(updatedProject));
    setShowTableForm(false);
    message.success('表创建成功');
    navigate(`/project/${id}/tables/${newTable.id}`);
  };

  const validateTableName = (_: any, value: string) => {
    if (!value) {
      return Promise.reject('请输入表名');
    }
    // 表名规范：只能包含字母、数字和下划线，必须以字母开头，长度在1-64之间
    const tableNamePattern = /^[a-zA-Z][a-zA-Z0-9_]{0,63}$/;
    if (!tableNamePattern.test(value)) {
      return Promise.reject('表名只能包含字母、数字和下划线，必须以字母开头，长度在1-64之间');
    }
    // 检查表名是否已存在
    if (project?.tables.some(t => t.name.toLowerCase() === value.toLowerCase())) {
      return Promise.reject('表名已存在');
    }
    return Promise.resolve();
  };

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setError('项目 ID 无效');
        setLoading(false);
        return;
      }

      try {
        if (!project) {
          const projects = loadProjectsFromStorage();
          if (projects.length > 0) {
            dispatch(loadProjects(projects));
            const foundProject = projects.find(p => p.id === id);
            if (foundProject) {
              dispatch(setCurrentProject(foundProject));
            } else {
              setError(`未找到 ID 为 ${id} 的项目，该项目可能已被删除或不存在`);
            }
          } else {
            setError('系统中还没有任何项目，请先创建一个新项目');
          }
        }
      } catch (err) {
        console.error('加载项目时出错:', err);
        setError('加载项目时出错，请刷新页面重试');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [dispatch, id, project]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="加载项目中..." />
      </div>
    );
  }

  if (error || !project) {
    return (
      <Result
        status="404"
        title="项目不存在"
        subTitle={error || '请确认项目 ID 是否正确'}
        extra={
          <Space>
            <Button type="primary" onClick={() => navigate('/')}>
              返回项目列表
            </Button>
            <Button onClick={() => window.location.reload()}>
              刷新页面
            </Button>
          </Space>
        }
      />
    );
  }

  const items = [
    {
      key: 'tables',
      label: '表管理',
      children: <TableEditor project={project} />,
    },
    {
      key: 'er',
      label: 'ER图',
      children: <ERDiagram project={project} />,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleCreateTable}>
          新建表
        </Button>
      </div>
      <Tabs items={items} />

      <Modal
        title="新建表"
        open={showTableForm}
        onCancel={() => setShowTableForm(false)}
        onOk={() => {
          const form = document.querySelector('form');
          if (form) {
            form.requestSubmit();
          }
        }}
      >
        <Form onFinish={handleTableFormSubmit}>
          <Form.Item
            name="name"
            label="表名"
            rules={[
              { required: true, message: '请输入表名' },
              { validator: validateTableName }
            ]}
          >
            <Input placeholder="请输入表名，只能包含字母、数字和下划线，必须以字母开头" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea placeholder="请输入表描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectDetail; 