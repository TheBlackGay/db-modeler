import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '../types/models';

const loadProjectsFromStorage = (): Project[] => {
  try {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      return JSON.parse(savedProjects);
    }
  } catch (error) {
    console.error('Failed to load projects from storage:', error);
  }
  return [];
};

const saveProjectsToStorage = (projects: Project[]) => {
  try {
    localStorage.setItem('projects', JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save projects to storage:', error);
  }
};

export interface ProjectsState {
  items: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  items: loadProjectsFromStorage(),
  currentProject: null,
  loading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    loadProjects: (state) => {
      try {
        state.loading = true;
        state.items = loadProjectsFromStorage();
        state.error = null;
      } catch (error) {
        state.error = '加载项目失败';
      } finally {
        state.loading = false;
      }
    },
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.items = action.payload;
      saveProjectsToStorage(action.payload);
    },
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.items.push(action.payload);
      saveProjectsToStorage(state.items);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
        saveProjectsToStorage(state.items);
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      if (state.currentProject?.id === action.payload) {
        state.currentProject = null;
      }
      saveProjectsToStorage(state.items);
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
  loadProjects,
  setProjects,
  setCurrentProject,
  addProject,
  updateProject,
  deleteProject,
  setLoading,
  setError,
} = projectsSlice.actions;

export default projectsSlice.reducer; 