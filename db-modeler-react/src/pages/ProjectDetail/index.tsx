import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, Spin, Result, Button, Space } from 'antd';
import type { RootState } from '../../store';
import type { Project } from '../../types/models';
import { loadProjects, setCurrentProject } from '../../store/projectsSlice';
import TableEditor from './TableEditor';
import ERDiagram from './ERDiagram';

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

  // 从 Redux store 获取项目数据
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

      try {
        // 如果 Redux store 中没有项目数据，尝试从 localStorage 加载
        if (!project) {
          const projects = loadProjectsFromStorage();
          console.log('从 localStorage 加载的项目列表:', projects);
          
          if (projects.length > 0) {
            // 先加载所有项目到 Redux store
            dispatch(loadProjects(projects));
            
            // 查找当前项目
            const foundProject = projects.find(p => p.id === id);
            console.log('找到的项目:', foundProject);
            
            if (foundProject) {
              // 设置当前项目
              dispatch(setCurrentProject(foundProject));
            } else {
              console.log('未找到项目，ID:', id);
              setError(`未找到 ID 为 ${id} 的项目，该项目可能已被删除或不存在`);
            }
          } else {
            console.log('项目列表为空');
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
      <Tabs items={items} />
    </div>
  );
};

export default ProjectDetail; 