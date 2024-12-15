import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { initializeState } from './store/projectsSlice';
import Layout from './components/Layout';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import TableDesigner from './components/TableDesigner';

// 确保在应用启动时加载数据
store.dispatch(initializeState());

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ProjectList />} />
            <Route path="project/:id" element={<ProjectDetail />} />
            <Route path="table/:id" element={<TableDesigner />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App; 