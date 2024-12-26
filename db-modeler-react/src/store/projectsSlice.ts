import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '../types/models';
import { 
  projectCreated,
  tableCreated,
  relationCreated,
  documentCompleted,
  featureUsed,
  setCurrentProject as setAchievementCurrentProject
} from './features/achievementSlice';

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
      console.log('切换当前项目:', {
        oldProject: state.currentProject?.id,
        newProject: action.payload?.id
      });
      
      state.currentProject = action.payload;
      if (action.payload) {
        featureUsed('project_selected');
        setAchievementCurrentProject(action.payload.id);
        console.log('项目已选择，同步到成就系统');
      } else {
        setAchievementCurrentProject(null);
        console.log('清除当前项目');
      }
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.items.push(action.payload);
      saveProjectsToStorage(state.items);
      projectCreated();
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
        setAchievementCurrentProject(null);
      }
      saveProjectsToStorage(state.items);
    },
    batchDeleteProjects: (state, action: PayloadAction<string[]>) => {
      console.log('批量删除项目:', {
        projectIds: action.payload,
        currentProjectId: state.currentProject?.id
      });

      state.items = state.items.filter(item => !action.payload.includes(item.id));
      
      if (state.currentProject && action.payload.includes(state.currentProject.id)) {
        state.currentProject = null;
        setAchievementCurrentProject(null);
        console.log('当前项目已被删除，清除当前项目');
      }

      saveProjectsToStorage(state.items);
      
      console.log('批量删除完成:', {
        remainingProjects: state.items.length,
        currentProject: state.currentProject?.id
      });
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addTable: (state, action) => {
      if (state.currentProject) {
        console.log('添加表格前状态:', {
          projectId: state.currentProject.id,
          currentTableCount: state.currentProject.tables.length
        });

        state.currentProject.tables.push(action.payload);
        tableCreated();
        
        console.log('添加表格后状态:', {
          projectId: state.currentProject.id,
          newTableCount: state.currentProject.tables.length,
          newTable: action.payload
        });
        
        if (action.payload.indexes?.length > 0) {
          console.log('检测到索引使用');
          featureUsed('indexes');
        }
        if (action.payload.constraints?.length > 0) {
          console.log('检测到约束使用');
          featureUsed('constraints');
        }
        if (action.payload.triggers?.length > 0) {
          console.log('检测到触发器使用');
          featureUsed('triggers');
        }
        if (action.payload.procedures?.length > 0) {
          console.log('检测到存储过程使用');
          featureUsed('procedures');
        }
      } else {
        console.warn('尝试添加表格但没有当前项目');
      }
    },
    addRelation: (state, action) => {
      if (state.currentProject) {
        const { tables } = state.currentProject;
        const { sourceTable, targetTable, type } = action.payload;
        
        const source = tables.find(t => t.id === sourceTable);
        const target = tables.find(t => t.id === targetTable);
        
        if (source && target) {
          if (!source.relations) source.relations = [];
          source.relations.push(action.payload);
          
          relationCreated();
          
          if (type === 'many-to-many') {
            featureUsed('complex_relations');
          }
        }
      }
    },
    completeDocumentation: (state, action) => {
      if (state.currentProject) {
        const { tables } = state.currentProject;
        const allTablesDocumented = tables.every(table => 
          table.description && 
          table.columns?.every(column => column.description)
        );
        
        if (allTablesDocumented) {
          documentCompleted();
          featureUsed('documentation');
        }
      }
    },
    completeProject: (state, action) => {
      if (state.currentProject) {
        const project = state.currentProject;
        const isComplete = 
          project.tables.length > 0 &&
          project.tables.every(table => 
            table.description &&
            table.columns &&
            table.columns.length > 0 &&
            table.columns.every(column => column.description)
          );
        
        if (isComplete) {
          featureUsed('project_completion');
          
          const createdTime = new Date(project.createdAt).getTime();
          const currentTime = new Date().getTime();
          if ((currentTime - createdTime) <= 10 * 60 * 1000) {
            featureUsed('speed_completion');
          }
        }
      }
    },
    validateProject: (state) => {
      if (state.currentProject) {
        featureUsed('validation');
      }
    },
    optimizeProject: (state) => {
      if (state.currentProject) {
        featureUsed('optimization');
      }
    },
    importProject: (state, action) => {
      state.items.push(action.payload);
      saveProjectsToStorage(state.items);
      featureUsed('import');
    },
    exportProject: (state) => {
      if (state.currentProject) {
        featureUsed('export');
      }
    }
  },
});

export const {
  loadProjects,
  setProjects,
  setCurrentProject,
  addProject,
  updateProject,
  deleteProject,
  batchDeleteProjects,
  setLoading,
  setError,
  addTable,
  addRelation,
  completeDocumentation,
  completeProject,
  validateProject,
  optimizeProject,
  importProject,
  exportProject
} = projectsSlice.actions;

export default projectsSlice.reducer; 