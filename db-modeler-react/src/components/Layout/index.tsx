import React, { useEffect } from 'react';
import { Layout as AntLayout } from 'antd';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AppHeader from '../AppHeader';
import AppSider from '../AppSider';
import type { RootState } from '../../store';
import type { Project } from '../../types/models';
import { loadProjects } from '../../store/projectsSlice';

const { Content } = AntLayout;

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

export const Layout: React.FC = () => {
  const location = useLocation();
  const params = useParams<{ id?: string; projectId?: string }>();
  const dispatch = useDispatch();
  const paths = location.pathname.split('/');
  const currentProjectId = params.projectId || params.id;
  const showSider = paths[1] === 'project' && currentProjectId;

  console.log('路由参数:', params);
  console.log('路径:', paths);
  console.log('项目ID:', currentProjectId);

  const project = useSelector((state: RootState) => {
    console.log('Redux store 状态:', state);
    console.log('当前 projectId:', currentProjectId);
    return state.projects.items.find((p: Project) => p.id === currentProjectId);
  });

  useEffect(() => {
    console.log('showSider:', showSider);
    console.log('project:', project);
    
    if (showSider && !project) {
      const projects = loadProjectsFromStorage();
      console.log('加载到的项目列表:', projects);
      if (projects.length > 0) {
        dispatch(loadProjects(projects));
      }
    }
  }, [dispatch, showSider, project, currentProjectId]);

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {showSider && project && <AppSider project={project} />}
      <AntLayout style={{ marginLeft: showSider ? 200 : 0 }}>
        <AppHeader />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
}; 