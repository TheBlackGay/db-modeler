import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './projectsSlice';
import templatesReducer from './templatesSlice';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    templates: templatesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 