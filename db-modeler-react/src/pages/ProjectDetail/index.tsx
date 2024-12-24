import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, Spin, Result, Button } from 'antd';
import type { RootState } from '../../store';
import type { Project } from '../../types/models';
import { loadProjects } from '../../store/projectsSlice';
import TableEditor from './TableEditor';
import ERDiagram from './ERDiagram';

const PROJECTS_STORAGE_KEY = 'db_modeler_projects';

const loadProjectsFromStorage = (): Project[] => {
  try {
    const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
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

  const project = useSelector((state: RootState) =>
    state.projects.items.find((p) => p.id === id)
  );

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setError('项目 ID 无效');
        setLoading(false);
        return;
      }

      if (!project) {
        try {
          const projects = loadProjectsFromStorage();
          if (projects.length > 0) {
            dispatch(loadProjects(projects));
            const foundProject = projects.find(p => p.id === id);
            if (!foundProject) {
              setError('项目不存在');
            }
          } else {
            setError('没有找到任何项目');
          }
        } catch (err) {
          setError('加载项目时出错');
          console.error('加载项目失败:', err);
        }
      }
      setLoading(false);
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
          <Button type="primary" onClick={() => navigate('/')}>
            返回首页
          </Button>
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
      <Tabs items={items} />
    </div>
  );
};

export default ProjectDetail; 