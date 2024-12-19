import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import TableEdit from './pages/TableEdit';
import DatabaseConnections from './pages/DatabaseConnections';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ProjectList />} />
            <Route path="project/:projectId" element={<ProjectDetail />} />
            <Route path="project/:projectId/tables/new" element={<TableEdit />} />
            <Route path="project/:projectId/tables/:tableId" element={<TableEdit />} />
            <Route path="project/:projectId/connections" element={<DatabaseConnections />} />
            <Route path="project/:projectId/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
};

export default App; 