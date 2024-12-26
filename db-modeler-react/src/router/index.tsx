import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/Layout';
import ProjectList from '../pages/ProjectList';
import ProjectDetail from '../pages/ProjectDetail';
import TableDesigner from '../components/TableDesigner';
import DatabaseConnections from '../pages/DatabaseConnections';
import Settings from '../pages/Settings';
import { ApiManager } from '../pages/ApiManager/ApiManager';
import InterfaceDebug from '../pages/interface/debug/InterfaceDebug';
import { Spin } from 'antd';
import ERDiagram from '../pages/ProjectDetail/ERDiagram';
import NotFound from '../pages/NotFound';
import FieldTemplates from '../pages/FieldTemplates';
import ApiDocs from '../pages/ApiDocs';
import DataDictionary from '../pages/DataDictionary';
import BatchEdit from '../pages/BatchEdit';

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Spin />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: withSuspense(NotFound),
    children: [
      {
        index: true,
        element: withSuspense(ProjectList),
      },
      {
        path: 'project/:id',
        element: withSuspense(ProjectDetail),
      },
      {
        path: 'project/:projectId/table/:tableId',
        element: withSuspense(TableDesigner),
      },
      {
        path: 'project/:projectId/api',
        element: withSuspense(ApiManager),
      },
      {
        path: 'project/:projectId/api/debug',
        element: withSuspense(InterfaceDebug),
      },
      {
        path: 'project/:projectId/api/docs',
        element: withSuspense(ApiDocs),
      },
      {
        path: 'project/:projectId/connections',
        element: withSuspense(DatabaseConnections),
      },
      {
        path: 'project/:projectId/settings',
        element: withSuspense(Settings),
      },
      {
        path: 'project/:projectId/er-diagram',
        element: withSuspense(ERDiagram),
      },
      {
        path: 'project/:projectId/field-templates',
        element: withSuspense(FieldTemplates),
      },
      {
        path: 'project/:projectId/data-dictionary',
        element: withSuspense(DataDictionary),
      },
      {
        path: 'project/:projectId/batch-edit',
        element: withSuspense(BatchEdit),
      },
      {
        path: '*',
        element: withSuspense(NotFound),
      }
    ],
  },
]); 