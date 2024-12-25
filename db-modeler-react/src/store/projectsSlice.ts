import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '../types/models';

interface ProjectsState {
  items: Project[];
  loading: boolean;
  error: string | null;
}

const loadProjectsFromStorage = (): Project[] => {
  try {
    console.log('Loading projects from storage...');
    const savedProjects = localStorage.getItem('projects');
    console.log('Raw saved projects:', savedProjects);
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects);
      console.log('Parsed projects:', parsedProjects);
      return parsedProjects;
    }
  } catch (error) {
    console.error('Failed to load projects from storage:', error);
  }
  console.log('No projects found in storage, returning empty array');
  return [];
};

const saveProjectsToStorage = (projects: Project[]) => {
  try {
    localStorage.setItem('projects', JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save projects to storage:', error);
  }
};

const initialState: ProjectsState = {
  items: loadProjectsFromStorage(),
  loading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    loadProjects: (state) => {
      try {
        state.loading = true;
        const loadedProjects = loadProjectsFromStorage();
        console.log('Loaded projects from storage:', loadedProjects);
        state.items = loadedProjects;
        state.error = null;
      } catch (error) {
        console.error('Failed to load projects:', error);
        state.error = '加载项目失败';
      } finally {
        state.loading = false;
      }
    },
    addProject: (state, action: PayloadAction<Project>) => {
      try {
        const newProject = {
          ...action.payload,
          id: action.payload.id || crypto.randomUUID(),
          tables: action.payload.tables || [],
          createdAt: action.payload.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        console.log('Adding new project:', newProject);
        state.items.push(newProject);
        saveProjectsToStorage(state.items);
        state.error = null;
      } catch (error) {
        console.error('Failed to add project:', error);
        state.error = '添加项目失败';
      }
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      try {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = {
            ...action.payload,
            updatedAt: new Date().toISOString(),
          };
          saveProjectsToStorage(state.items);
          state.error = null;
        } else {
          state.error = '项目不存在';
        }
      } catch (error) {
        state.error = '更新项目失败';
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      try {
        state.items = state.items.filter(p => p.id !== action.payload);
        saveProjectsToStorage(state.items);
        state.error = null;
      } catch (error) {
        state.error = '删除项目失败';
      }
    },
  },
});

export const {
  setLoading,
  setError,
  loadProjects,
  addProject,
  updateProject,
  deleteProject,
} = projectsSlice.actions;

export default projectsSlice.reducer; 