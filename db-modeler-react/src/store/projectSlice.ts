import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DatabaseConnection {
  id: string;
  name: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  theme: {
    darkMode: boolean;
    primaryColor: string;
    compactMode: boolean;
  };
  database: {
    connectionTimeout: number;
    maxConnections: number;
    defaultDatabase: string;
    sslEnabled: boolean;
  };
  export: {
    indentStyle: 'space' | 'tab';
    indentSize: number;
    lineEnding: 'lf' | 'crlf';
    upperCase: boolean;
  };
}

interface Project {
  id: string;
  name: string;
  description: string;
  connections: DatabaseConnection[];
  settings: Settings;
  createdAt: string;
  updatedAt: string;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
      if (state.currentProject?.id === action.payload) {
        state.currentProject = null;
      }
    },
    setCurrentProject: (state, action: PayloadAction<string>) => {
      const project = state.projects.find(p => p.id === action.payload);
      state.currentProject = project || null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addConnection: (state, action: PayloadAction<{ projectId: string; connection: DatabaseConnection }>) => {
      const project = state.projects.find(p => p.id === action.payload.projectId);
      if (project) {
        project.connections.push(action.payload.connection);
        if (state.currentProject?.id === action.payload.projectId) {
          state.currentProject = project;
        }
      }
    },
    updateConnection: (state, action: PayloadAction<{ projectId: string; connection: DatabaseConnection }>) => {
      const project = state.projects.find(p => p.id === action.payload.projectId);
      if (project) {
        const index = project.connections.findIndex(c => c.id === action.payload.connection.id);
        if (index !== -1) {
          project.connections[index] = action.payload.connection;
          if (state.currentProject?.id === action.payload.projectId) {
            state.currentProject = project;
          }
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
      }
    },
  },
});

export const {
  addProject,
  updateProject,
  deleteProject,
  setCurrentProject,
  setLoading,
  addConnection,
  updateConnection,
  deleteConnection,
} = projectSlice.actions;
export default projectSlice.reducer; 