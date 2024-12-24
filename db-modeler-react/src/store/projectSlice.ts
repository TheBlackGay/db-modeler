import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { saveProjects } from '../utils/storage';
import type { IProject, IConnection } from '../types';

interface ProjectState {
  projects: IProject[];
  currentProject: IProject | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<IProject[]>) => {
      state.projects = action.payload;
      saveProjects(state.projects);
    },
    addProject: (state, action: PayloadAction<IProject>) => {
      state.projects.push(action.payload);
      saveProjects(state.projects);
    },
    updateProject: (state, action: PayloadAction<IProject>) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
        saveProjects(state.projects);
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
      if (state.currentProject?.id === action.payload) {
        state.currentProject = null;
      }
      saveProjects(state.projects);
    },
    setCurrentProject: (state, action: PayloadAction<string>) => {
      const project = state.projects.find(p => p.id === action.payload);
      state.currentProject = project || null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addConnection: (state, action: PayloadAction<{ projectId: string; connection: IConnection }>) => {
      const project = state.projects.find(p => p.id === action.payload.projectId);
      if (project) {
        project.connections.push(action.payload.connection);
        if (state.currentProject?.id === action.payload.projectId) {
          state.currentProject = project;
        }
        saveProjects(state.projects);
      }
    },
    updateConnection: (state, action: PayloadAction<{ projectId: string; connection: IConnection }>) => {
      const project = state.projects.find(p => p.id === action.payload.projectId);
      if (project) {
        const index = project.connections.findIndex(c => c.id === action.payload.connection.id);
        if (index !== -1) {
          project.connections[index] = action.payload.connection;
          if (state.currentProject?.id === action.payload.projectId) {
            state.currentProject = project;
          }
          saveProjects(state.projects);
        }
      }
    },
    deleteConnection: (state, action: PayloadAction<{ projectId: string; connectionId: string }>) => {
      const project = state.projects.find(p => p.id === action.payload.projectId);
      if (project) {
        project.connections = project.connections.filter(c => c.id !== action.payload.connectionId);
        if (state.currentProject?.id === action.payload.projectId) {
          state.currentProject = project;
        }
        saveProjects(state.projects);
      }
    },
  },
});

export const {
  setProjects,
  addProject,
  updateProject,
  deleteProject,
  setCurrentProject,
  setLoading,
  setError,
  addConnection,
  updateConnection,
  deleteConnection,
} = projectSlice.actions;

export default projectSlice.reducer; 