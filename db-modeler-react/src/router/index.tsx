import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/Layout';
import ProjectList from '../pages/ProjectList';
import ProjectDetail from '../pages/ProjectDetail';
import TableDesigner from '../components/TableDesigner';
import { DatabaseConnections } from '../pages/DatabaseConnections';
import { Settings } from '../pages/Settings';
import { ApiManager } from '../pages/ApiManager/ApiManager';
import InterfaceDebug from '../pages/interface/debug/InterfaceDebug';
import { Spin } from 'antd';
import ERDiagram from '../pages/ProjectDetail/ERDiagram';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Spin />}>
            <ProjectList />
          </Suspense>
        ),
      },
      {
        path: 'project/:id',
        element: (
          <Suspense fallback={<Spin />}>
            <ProjectDetail />
          </Suspense>
        ),
      },
      {
        path: 'project/:projectId/tables/:tableId',
        element: (
          <Suspense fallback={<Spin />}>
            <TableDesigner />
          </Suspense>
        ),
      },
      {
        path: 'project/:projectId/table/:tableId',
        element: (
          <Suspense fallback={<Spin />}>
            <TableDesigner />
          </Suspense>
        ),
      },
      {
        path: 'project/:projectId/api',
        element: (
          <Suspense fallback={<Spin />}>
            <ApiManager />
          </Suspense>
        ),
      },
      {
        path: 'project/:projectId/api/debug',
        element: (
          <Suspense fallback={<Spin />}>
            <InterfaceDebug />
          </Suspense>
        ),
      },
      {
        path: 'project/:projectId/connections',
        element: (
          <Suspense fallback={<Spin />}>
            <DatabaseConnections />
          </Suspense>
        ),
      },
      {
        path: 'project/:projectId/settings',
        element: (
          <Suspense fallback={<Spin />}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: 'project/:projectId/er-diagram',
        element: (
          <Suspense fallback={<Spin />}>
            <ERDiagram />
          </Suspense>
        ),
      },
    ],
  },
]); 