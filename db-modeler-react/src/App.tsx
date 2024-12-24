import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadProjects } from './store/projectsSlice';
import { mockProjects } from './data/mockData';
import { router } from './router';

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Loading mock projects:', mockProjects);
    dispatch(loadProjects(mockProjects));
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

export default App; 