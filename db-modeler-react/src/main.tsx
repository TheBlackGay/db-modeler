import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { App } from './App';
import './index.css';
import projectReducer from './store/projectSlice';
import apiReducer from './store/apiSlice';

// 创建 Redux store
const store = configureStore({
  reducer: {
    projects: projectReducer,
    api: apiReducer,
  },
});

// 导出 RootState 类型
export type RootState = ReturnType<typeof store.getState>;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
); 