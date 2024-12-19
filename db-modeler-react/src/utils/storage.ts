import { IProject } from '../data/mockData';

const STORAGE_KEY = 'db-modeler-projects';

// 从 localStorage 加载项目数据
export const loadProjects = (): IProject[] => {
  try {
    const projectsJson = localStorage.getItem(STORAGE_KEY);
    return projectsJson ? JSON.parse(projectsJson) : [];
  } catch (error) {
    console.error('Failed to load projects:', error);
    return [];
  }
};

// 保存项目数据到 localStorage
export const saveProjects = (projects: IProject[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save projects:', error);
  }
}; 