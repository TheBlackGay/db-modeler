import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProject } from '../data/mockData';
import { saveProjects } from '../utils/storage';

interface ProjectsState {
  items: IProject[];
  currentProject: IProject | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  items: [],
  currentProject: null,
  loading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<IProject[]>) => {
      state.items = action.payload;
    },
    setCurrentProject: (state, action: PayloadAction<string>) => {
      state.currentProject = state.items.find(p => p.id === action.payload) || null;
    },
    addProject: (state, action: PayloadAction<IProject>) => {
      state.items.push(action.payload);
      saveProjects(state.items);
    },
    updateProject: (state, action: PayloadAction<IProject>) => {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
        saveProjects(state.items);
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(p => p.id !== action.payload);
      if (state.currentProject?.id === action.payload) {
        state.currentProject = null;
      }
      saveProjects(state.items);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProjects,
  setCurrentProject,
  addProject,
  updateProject,
  deleteProject,
  setLoading,
  setError,
} = projectsSlice.actions;

export default projectsSlice.reducer; 