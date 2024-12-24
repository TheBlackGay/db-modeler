import type { IProject } from '../types';
import type { Environment } from '../store/envSlice';

const STORAGE_KEY = 'db-modeler-projects';
const STORAGE_KEYS = {
  ENVIRONMENTS: 'db_modeler_environments',
  CURRENT_ENV: 'db_modeler_current_env',
  REQUEST_HISTORY: 'db_modeler_request_history',
} as const;

// 从 localStorage 加载项目数据
export const loadProjects = (): IProject[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load projects:', error);
    return [];
  }
};

// 保存项目数据到 localStorage
export const saveProjects = (projects: IProject[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save projects:', error);
  }
};

export const saveEnvironments = (environments: Environment[]) => {
  localStorage.setItem(STORAGE_KEYS.ENVIRONMENTS, JSON.stringify(environments));
};

export const loadEnvironments = (): Environment[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ENVIRONMENTS);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to parse environments:', error);
    }
  }
  return [];
};

export const saveCurrentEnvId = (envId: string) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_ENV, envId);
};

export const loadCurrentEnvId = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_ENV);
};

export const saveRequestHistory = (history: any[]) => {
  localStorage.setItem(STORAGE_KEYS.REQUEST_HISTORY, JSON.stringify(history));
};

export const loadRequestHistory = (): any[] => {
  const data = localStorage.getItem(STORAGE_KEYS.REQUEST_HISTORY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to parse request history:', error);
    }
  }
  return [];
}; 