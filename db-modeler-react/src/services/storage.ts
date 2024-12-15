import type { Project } from '../types/models';

const STORAGE_KEY = 'db_modeler_projects';

export const loadProjects = (): Project[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('加载项目数据失败:', error);
    return [];
  }
};

export const saveProjects = (projects: Project[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('保存项目数据失败:', error);
  }
};

export const exportProject = (project: Project): void => {
  try {
    const dataStr = JSON.stringify(project, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileName = `${project.name}_${new Date().toISOString()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
  } catch (error) {
    console.error('导出项目失败:', error);
    throw new Error('导出项目失败');
  }
};

export const importProject = (file: File): Promise<Project> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const project: Project = JSON.parse(content);
        
        // 验证项目数据结构
        if (!project.id || !project.name || !Array.isArray(project.tables)) {
          throw new Error('无效的项目文件格式');
        }

        resolve(project);
      } catch (error) {
        reject(new Error('解析项目文件失败'));
      }
    };

    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.readAsText(file);
  });
}; 