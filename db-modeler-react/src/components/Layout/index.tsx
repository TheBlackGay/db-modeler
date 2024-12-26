import React, { useEffect } from 'react';
import { Layout as AntLayout } from 'antd';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AppHeader from '../AppHeader';
import AppSider from '../AppSider';
import type { RootState } from '../../store';
import type { Project } from '../../types/models';
import { loadProjects, setCurrentProject } from '../../store/projectsSlice';

const { Content } = AntLayout;

export const Layout: React.FC = () => {
  const location = useLocation();
  const params = useParams<{ id?: string; projectId?: string }>();
  const dispatch = useDispatch();
  const paths = location.pathname.split('/');
  const currentProjectId = params.projectId || params.id;
  const showSider = paths[1] === 'project' && currentProjectId;

  const { items: projects, currentProject } = useSelector((state: RootState) => state.projects);

  useEffect(() => {
    // 初始加载项目列表
    dispatch(loadProjects());
  }, [dispatch]);

  useEffect(() => {
    // 当路由中的项目ID变化时，更新当前项目
    if (currentProjectId) {
      const project = projects.find(p => p.id === currentProjectId);
      if (project && (!currentProject || currentProject.id !== currentProjectId)) {
        dispatch(setCurrentProject(project));
      }
    } else {
      dispatch(setCurrentProject(null));
    }
  }, [dispatch, currentProjectId, projects, currentProject]);

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {showSider && currentProject && <AppSider project={currentProject} />}
      <AntLayout style={{ marginLeft: showSider ? 200 : 0 }}>
        <AppHeader />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
}; 