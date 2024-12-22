import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ProjectList } from '../pages/ProjectList';
import { NewProject } from '../pages/NewProject';
import { ProjectDetail } from '../pages/ProjectDetail';
import { TableEdit } from '../pages/TableEdit';
import { DatabaseConnections } from '../pages/DatabaseConnections';
import { Settings } from '../pages/Settings';
import { ApiManager } from '../pages/ApiManager';
import { interfaceRoutes } from '../pages/interface/routes';
import { Spin } from 'antd';

// 创建加载中组件
const LoadingComponent: React.FC = () => (
  <div style={{ padding: '50px', textAlign: 'center' }}>
    <Spin size="large" />
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <ProjectList />,
      },
      {
        path: '/project/new',
        element: <NewProject />,
      },
      {
        path: '/project/:projectId',
        element: <ProjectDetail />,
      },
      {
        path: '/project/:projectId/table/:tableId',
        element: <TableEdit />,
      },
      {
        path: '/project/:projectId/table/new',
        element: <TableEdit />,
      },
      {
        path: '/connections',
        element: <DatabaseConnections />,
      },
      {
        path: '/api-manager',
        element: <ApiManager />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      // 添加接口管理模块路由
      ...interfaceRoutes.map(route => ({
        ...route,
        element: (
          <Suspense fallback={<LoadingComponent />}>
            {route.element}
          </Suspense>
        ),
      })),
    ],
  },
]);

export { router }; 