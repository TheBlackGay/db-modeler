import type { Project, Field, FieldTemplate, FieldTemplateCategory } from '../types/models';
import { mockFields } from '../data/mockFieldLibrary';

const STORAGE_KEY = 'db-modeler-projects';
const FIELD_LIBRARY_KEY = 'db-modeler-field-library';
const FIELD_LIBRARY_INITIALIZED_KEY = 'db-modeler-field-library-initialized';
const FIELD_TEMPLATES_KEY = 'db-modeler-field-templates';
const TEMPLATE_CATEGORIES_KEY = 'db-modeler-template-categories';

// 解析 JSON 数据，如果解析失败则返回默认值
const parse = <T>(json: string | null, defaultValue: T): T => {
  if (!json) return defaultValue;
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error('解析 JSON 失败:', error);
    return defaultValue;
  }
};

// 加载字段库
export const loadFieldLibrary = (): Field[] => {
  try {
    // 检查是否已初始化
    const isInitialized = localStorage.getItem(FIELD_LIBRARY_INITIALIZED_KEY);
    if (!isInitialized) {
      // 首次加载，初始化模拟数据
      localStorage.setItem(FIELD_LIBRARY_KEY, JSON.stringify(mockFields));
      localStorage.setItem(FIELD_LIBRARY_INITIALIZED_KEY, 'true');
      return mockFields;
    }

    const data = localStorage.getItem(FIELD_LIBRARY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('加载字段库失败:', error);
    return [];
  }
};

// 保存字段到字段库
export const saveFieldToLibrary = (field: Field): void => {
  try {
    const fields = loadFieldLibrary();
    fields.push(field);
    localStorage.setItem(FIELD_LIBRARY_KEY, JSON.stringify(fields));
  } catch (error) {
    console.error('保存字段失败:', error);
    throw error;
  }
};

// 从字段库中删除字段
export const removeFieldFromLibrary = (fieldId: string): void => {
  try {
    const fields = loadFieldLibrary();
    const updatedFields = fields.filter(f => f.id !== fieldId);
    localStorage.setItem(FIELD_LIBRARY_KEY, JSON.stringify(updatedFields));
  } catch (error) {
    console.error('删除字段失败:', error);
    throw error;
  }
};

// 加载项目列表
export const loadProjects = (): Project[] => {
  return parse(localStorage.getItem(STORAGE_KEY), []);
};

// 保存项目列表
export const saveProjects = (projects: Project[]) => {
  try {
    // 创建一个深拷贝，确保所有嵌套对象都被正确序列化
    const projectsToSave = projects.map(project => ({
      ...project,
      tables: project.tables.map(table => ({
        ...table,
        fields: [...table.fields],
        updatedAt: table.updatedAt || new Date().toISOString(),
      })),
      updatedAt: project.updatedAt || new Date().toISOString(),
    }));
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projectsToSave));
  } catch (error) {
    console.error('保存项目失败:', error);
  }
};

export const exportProject = (project: Project): void => {
  const dataStr = JSON.stringify(project, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const exportFileDefaultName = `${project.name.toLowerCase().replace(/\s+/g, '_')}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const importProject = async (file: File): Promise<Project> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const project = JSON.parse(e.target?.result as string);
        if (!project.id || !project.name || !Array.isArray(project.tables)) {
          throw new Error('无效的项目数据结构');
        }
        resolve(project);
      } catch (error: unknown) {
        if (error instanceof Error && error.message === '无效的项目数据结构') {
          reject(error);
        } else {
          reject(new Error('无效的项目文件格式'));
        }
      }
    };
    reader.readAsText(file);
  });
};

// 加载字段模板
export const loadFieldTemplates = (): FieldTemplate[] => {
  return parse(localStorage.getItem(FIELD_TEMPLATES_KEY), []);
};

// 保存字段模板
export const saveFieldTemplates = (templates: FieldTemplate[]) => {
  localStorage.setItem(FIELD_TEMPLATES_KEY, JSON.stringify(templates));
};

// 添加字段模板
export const addFieldTemplate = (template: FieldTemplate) => {
  const templates = loadFieldTemplates();
  templates.push(template);
  saveFieldTemplates(templates);
};

// 更新字段模板
export const updateFieldTemplate = (id: string, data: Partial<FieldTemplate>) => {
  const templates = loadFieldTemplates();
  const index = templates.findIndex(t => t.id === id);
  if (index !== -1) {
    templates[index] = { ...templates[index], ...data };
    saveFieldTemplates(templates);
  }
};

// 删除字段模板
export const deleteFieldTemplate = (id: string) => {
  const templates = loadFieldTemplates();
  const updatedTemplates = templates.filter(t => t.id !== id);
  saveFieldTemplates(updatedTemplates);
};

// 加载模板分类
export const loadTemplateCategories = (): FieldTemplateCategory[] => {
  const now = new Date().toISOString();
  return parse(localStorage.getItem(TEMPLATE_CATEGORIES_KEY), [
    {
      id: 'basic',
      name: '基础字段',
      description: '常用的基础字段类型',
      isBuiltin: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'custom',
      name: '自定义字段',
      description: '用户自定义的字段模板',
      isBuiltin: false,
      createdAt: now,
      updatedAt: now
    }
  ]);
};

// 保存模板分类
export const saveTemplateCategories = (categories: FieldTemplateCategory[]) => {
  localStorage.setItem(TEMPLATE_CATEGORIES_KEY, JSON.stringify(categories));
};

// 添加模板分类
export const addTemplateCategory = (category: FieldTemplateCategory) => {
  const categories = loadTemplateCategories();
  categories.push(category);
  saveTemplateCategories(categories);
};

// 更新模板分类
export const updateTemplateCategory = (id: string, data: Partial<FieldTemplateCategory>) => {
  const categories = loadTemplateCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index !== -1) {
    categories[index] = { ...categories[index], ...data };
    saveTemplateCategories(categories);
  }
};

// 删除模板分类
export const deleteTemplateCategory = (id: string) => {
  const categories = loadTemplateCategories();
  const updatedCategories = categories.filter(c => c.id !== id);
  saveTemplateCategories(updatedCategories);
};

export const saveFieldLibrary = async (fields: Field[]): Promise<void> => {
  try {
    localStorage.setItem(FIELD_LIBRARY_KEY, JSON.stringify(fields));
  } catch (error) {
    console.error('保存字段库失败:', error);
    throw error;
  }
}; 