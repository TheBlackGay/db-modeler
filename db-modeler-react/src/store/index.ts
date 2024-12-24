import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './projectsSlice';
import templatesReducer from './templatesSlice';
import apiReducer from './apiSlice';
import historyReducer from './historySlice';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    templates: templatesReducer,
    api: apiReducer,
    history: historyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 