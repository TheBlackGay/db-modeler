import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Project, Table } from '../types/models';

interface ProjectsState {
  items: Project[];
  loading: boolean;
  error: string | null;
  currentProject: Project | null;
}

const PROJECTS_STORAGE_KEY = 'db_modeler_projects';

const loadProjectsFromStorage = (): Project[] => {
  try {
    const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
    return storedProjects ? JSON.parse(storedProjects) : [];
  } catch (error) {
    console.error('加载项目失败:', error);
    return [];
  }
};

const saveProjectsToStorage = (projects: Project[]) => {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('保存项目失败:', error);
  }
};

const initialState: ProjectsState = {
  items: loadProjectsFromStorage(),
  loading: false,
  error: null,
  currentProject: null,
};

interface UpdateTablePayload {
  projectId: string;
  tableId: string;
  data: Table;
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action: PayloadAction<Project>) => {
      state.items.push(action.payload);
      saveProjectsToStorage(state.items);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        saveProjectsToStorage(state.items);
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(p => p.id !== action.payload);
      saveProjectsToStorage(state.items);
    },
    loadProjects: (state, action: PayloadAction<Project[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
      saveProjectsToStorage(state.items);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setCurrentProject: (state, action: PayloadAction<Project>) => {
      state.currentProject = action.payload;
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        saveProjectsToStorage(state.items);
      }
    },
    updateTable: (state, action: PayloadAction<UpdateTablePayload>) => {
      const { projectId, tableId, data } = action.payload;
      const projectIndex = state.items.findIndex(p => p.id === projectId);
      if (projectIndex !== -1) {
        const tableIndex = state.items[projectIndex].tables.findIndex(t => t.id === tableId);
        if (tableIndex !== -1) {
          state.items[projectIndex].tables[tableIndex] = data;
          state.items[projectIndex].updatedAt = new Date().toISOString();
          if (state.currentProject?.id === projectId) {
            state.currentProject = state.items[projectIndex];
          }
          saveProjectsToStorage(state.items);
        }
      }
    },
  },
});

export const { 
  addProject, 
  updateProject, 
  deleteProject, 
  loadProjects,
  setLoading,
  setError,
  setCurrentProject,
  updateTable,
} = projectsSlice.actions;

export default projectsSlice.reducer; 