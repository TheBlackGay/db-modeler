import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import ProjectList from '../pages/ProjectList';
import NewProject from '../pages/NewProject';
import ProjectDetail from '../pages/ProjectDetail';
import TableEdit from '../pages/TableEdit';
import DatabaseConnections from '../pages/DatabaseConnections';
import Settings from '../pages/Settings';

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
        path: '/project/:projectId/connections',
        element: <DatabaseConnections />,
      },
      {
        path: '/project/:projectId/settings',
        element: <Settings />,
      },
    ],
  },
]);

export default router; 