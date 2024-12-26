import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './projectsSlice';
import templatesReducer from './templatesSlice';
import achievementReducer from './features/achievementSlice';
import generationReducer from './features/generationSlice';
import teamReducer from './features/teamSlice';
import specialReducer from './features/specialSlice';
import toolsReducer from './features/toolsSlice';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    templates: templatesReducer,
    achievement: achievementReducer,
    generation: generationReducer,
    team: teamReducer,
    special: specialReducer,
    tools: toolsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 