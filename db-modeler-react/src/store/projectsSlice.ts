import { createSlice, PayloadAction, Middleware } from '@reduxjs/toolkit';
import { Project, Field } from '../types/models';
import { generateId } from '../utils/helpers';
import { loadProjects, saveProjects } from '../services/storage';

interface ProjectsState {
  items: Project[];
  loading: boolean;
  error: string | null;
  currentProject: Project | null;
}

const initialState: ProjectsState = {
  items: [],
  loading: false,
  error: null,
  currentProject: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    initializeState: (state) => {
      state.items = loadProjects();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addProject: (state, action: PayloadAction<Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tables'>>) => {
      const timestamp = new Date().toISOString();
      const newProject: Project = {
        id: generateId(),
        ...action.payload,
        tables: [],
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      state.items.push(newProject);
    },
    updateProject: (state, action: PayloadAction<{ id: string; data: Partial<Project> }>) => {
      const { id, data } = action.payload;
      const project = state.items.find(p => p.id === id);
      if (project) {
        Object.assign(project, {
          ...data,
          updatedAt: new Date().toISOString(),
        });
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(project => project.id !== action.payload);
      if (state.currentProject?.id === action.payload) {
        state.currentProject = null;
      }
    },
    setCurrentProject: (state, action: PayloadAction<string>) => {
      state.currentProject = state.items.find(p => p.id === action.payload) || null;
    },
    addTable: (state, action: PayloadAction<{ projectId: string; name: string; comment?: string }>) => {
      const project = state.items.find(p => p.id === action.payload.projectId);
      if (project) {
        const timestamp = new Date().toISOString();
        project.tables.push({
          id: generateId(),
          name: action.payload.name,
          comment: action.payload.comment,
          fields: [],
          createdAt: timestamp,
          updatedAt: timestamp,
        });
        project.updatedAt = timestamp;
      }
    },
    updateTable: (state, action: PayloadAction<{ projectId: string; tableId: string; data: Partial<Omit<Project, 'id' | 'fields'>> }>) => {
      const { projectId, tableId, data } = action.payload;
      const project = state.items.find(p => p.id === projectId);
      if (project) {
        const table = project.tables.find(t => t.id === tableId);
        if (table) {
          Object.assign(table, {
            ...data,
            updatedAt: new Date().toISOString(),
          });
          project.updatedAt = new Date().toISOString();
        }
      }
    },
    deleteTable: (state, action: PayloadAction<{ projectId: string; tableId: string }>) => {
      const { projectId, tableId } = action.payload;
      const project = state.items.find(p => p.id === projectId);
      if (project) {
        project.tables = project.tables.filter(table => table.id !== tableId);
        project.updatedAt = new Date().toISOString();
      }
    },
    addField: (state, action: PayloadAction<{ 
      projectId: string; 
      tableId: string; 
      field: Omit<Field, 'id'> 
    }>) => {
      const { projectId, tableId, field } = action.payload;
      const project = state.items.find(p => p.id === projectId);
      if (project) {
        const table = project.tables.find(t => t.id === tableId);
        if (table) {
          table.fields.push({
            id: generateId(),
            ...field,
          });
          project.updatedAt = new Date().toISOString();
          table.updatedAt = new Date().toISOString();
        }
      }
    },
    updateField: (state, action: PayloadAction<{
      projectId: string;
      tableId: string;
      fieldId: string;
      field: Partial<Omit<Field, 'id'>>;
    }>) => {
      const { projectId, tableId, fieldId, field } = action.payload;
      const project = state.items.find(p => p.id === projectId);
      if (project) {
        const table = project.tables.find(t => t.id === tableId);
        if (table) {
          const existingField = table.fields.find(f => f.id === fieldId);
          if (existingField) {
            Object.assign(existingField, field);
            project.updatedAt = new Date().toISOString();
            table.updatedAt = new Date().toISOString();
          }
        }
      }
    },
    deleteField: (state, action: PayloadAction<{
      projectId: string;
      tableId: string;
      fieldId: string;
    }>) => {
      const { projectId, tableId, fieldId } = action.payload;
      const project = state.items.find(p => p.id === projectId);
      if (project) {
        const table = project.tables.find(t => t.id === tableId);
        if (table) {
          table.fields = table.fields.filter(f => f.id !== fieldId);
          project.updatedAt = new Date().toISOString();
          table.updatedAt = new Date().toISOString();
        }
      }
    },
    importProject: (state, action: PayloadAction<Project>) => {
      const existingProject = state.items.find(p => p.id === action.payload.id);
      if (existingProject) {
        Object.assign(existingProject, {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        });
      } else {
        state.items.push({
          ...action.payload,
          updatedAt: new Date().toISOString(),
        });
      }
    },
  },
});

// 定义 RootState 类型并导出
export interface RootState {
  projects: ProjectsState;
}

// 创建一个中间件来处理数据持久化
export const persistMiddleware: Middleware<{}, RootState> = 
  (store) => (next) => (action) => {
  const result = next(action);
  
  // 只有当 action 是 projects slice 的操作时才保存数据
  if (typeof action === 'object' && action !== null && 'type' in action) {
    const actionType = action.type as string;
    if (actionType.startsWith('projects/') && 
        actionType !== 'projects/setLoading' && 
        actionType !== 'projects/setError' &&
        actionType !== 'projects/setCurrentProject' &&
        actionType !== 'projects/initializeState') {
      const state = store.getState();
      saveProjects(state.projects.items);
    }
  }
  
  return result;
};

export const {
  setLoading,
  setError,
  addProject,
  updateProject,
  deleteProject,
  setCurrentProject,
  addTable,
  updateTable,
  deleteTable,
  addField,
  updateField,
  deleteField,
  importProject,
  initializeState,
} = projectsSlice.actions;

export default projectsSlice.reducer; 