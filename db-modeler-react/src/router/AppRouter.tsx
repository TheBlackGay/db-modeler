import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Projects from '../pages/Projects';
import ProjectDetail from '../pages/ProjectDetail';
import TableEdit from '../pages/TableEdit';
import DatabaseConnections from '../pages/DatabaseConnections';
import ApiManager from '../pages/ApiManager';
import Settings from '../pages/Settings';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/projects" replace />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/project/:projectId" element={<ProjectDetail />} />
      <Route path="/project/:projectId/table/:tableId" element={<TableEdit />} />
      <Route path="/connections" element={<DatabaseConnections />} />
      <Route path="/api" element={<ApiManager />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default AppRouter; 