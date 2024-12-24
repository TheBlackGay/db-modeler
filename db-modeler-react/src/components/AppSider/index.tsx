import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DatabaseOutlined,
  TableOutlined,
  SettingOutlined,
  CloudServerOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { loadProjects } from '../../store/projectsSlice';
import type { Project } from '../../types/models';

const { Sider } = Layout;

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

const AppSider: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);

  const paths = location.pathname.split('/');
  const projectId = paths[2];

  const currentProject = useSelector((state: RootState) => 
    state.projects.items.find(p => p.id === projectId)
  );

  useEffect(() => {
    if (!currentProject && projectId) {
      const projects = loadProjectsFromStorage();
      if (projects.length > 0) {
        dispatch(loadProjects(projects));
      }
    }
  }, [currentProject, dispatch, projectId]);

  if (!currentProject) {
    return null;
  }

  const selectedKeys = (() => {
    if (paths[3] === 'tables' && paths[4]) {
      return [`table-${paths[4]}`];
    }
    if (paths[3] === 'api') {
      return ['api'];
    }
    return ['tables-list'];
  })();

  const openKeys = ['tables', 'api'];

  const items = [
    {
      key: 'tables',
      icon: <DatabaseOutlined />,
      label: '数据表',
      children: [
        {
          key: 'tables-list',
          icon: <TableOutlined />,
          label: '表列表',
          onClick: () => navigate(`/project/${currentProject.id}`),
        },
        ...(currentProject.tables || []).map(table => ({
          key: `table-${table.id}`,
          icon: <TableOutlined />,
          label: table.name,
          onClick: () => navigate(`/project/${currentProject.id}/tables/${table.id}`),
        })),
      ],
    },
    {
      key: 'api',
      icon: <ApiOutlined />,
      label: 'API 管理',
      children: [
        {
          key: 'api-list',
          icon: <ApiOutlined />,
          label: '接口列表',
          onClick: () => navigate(`/project/${currentProject.id}/api`),
        },
        {
          key: 'api-debug',
          icon: <ApiOutlined />,
          label: '接口调试',
          onClick: () => navigate(`/project/${currentProject.id}/api/debug`),
        },
      ],
    },
    {
      key: 'project-settings',
      icon: <SettingOutlined />,
      label: '项目设置',
      children: [
        {
          key: 'connections',
          icon: <CloudServerOutlined />,
          label: '数据库连接',
          onClick: () => navigate(`/project/${currentProject.id}/connections`),
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: '项目配置',
          onClick: () => navigate(`/project/${currentProject.id}/settings`),
        },
      ],
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      theme="light"
      width={200}
      className="border-r border-gray-200"
    >
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        defaultOpenKeys={openKeys}
        items={items}
        className="h-full"
      />
    </Sider>
  );
};

export default AppSider; 