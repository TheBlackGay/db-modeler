import { describe, it, expect, beforeEach } from '@jest/globals';
import { 
  loadProjects, 
  saveProjects, 
  loadFieldLibrary,
  saveFieldToLibrary,
  removeFieldFromLibrary,
  loadFieldTemplates,
  saveFieldTemplates,
  addFieldTemplate,
  updateFieldTemplate,
  deleteFieldTemplate,
  loadTemplateCategories,
  saveTemplateCategories,
  addTemplateCategory,
  updateTemplateCategory,
  deleteTemplateCategory,
} from '../storage';
import type { Field, Project, FieldTemplate, FieldTemplateCategory } from '../../types/models';

// Mock 外部依赖
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// 测试数据准备
const mockField: Field = {
  id: 'field1',
  name: 'id',
  type: 'INT',
  length: 11,
  nullable: false,
  defaultValue: '',
  comment: '主键',
  isPrimaryKey: true,
  isAutoIncrement: true,
  unique: true,
  index: false,
  unsigned: true,
  zerofill: false,
};

const mockTable = {
  id: 'table1',
  name: '用户表',
  comment: '存储用户信息',
  fields: [mockField],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockProject: Project = {
  id: 'project1',
  name: '测试项目',
  description: '这是一个测试项目',
  tables: [mockTable],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockTemplate: FieldTemplate = {
  id: 'template1',
  name: 'ID字段',
  type: 'INT',
  description: '主键ID字段',
  category: 'basic',
  length: 11,
  nullable: false,
  defaultValue: '',
  comment: '主键',
  isPrimaryKey: true,
  isAutoIncrement: true,
  unique: true,
  index: false,
  unsigned: true,
  zerofill: false,
  isBuiltin: true,
};

const mockCategory: FieldTemplateCategory = {
  id: 'test-category',
  name: '测试分类',
  description: '这是一个测试分类',
  isBuiltin: false,
};

describe('存储服务', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('字段库操作', () => {
    it('应该能保存字段到字段库', () => {
      saveFieldToLibrary(mockField);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'db-modeler-field-library',
        JSON.stringify([mockField])
      );
    });

    it('应该能加载字段库', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockField]));
      const fields = loadFieldLibrary();
      expect(fields).toEqual([mockField]);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('db-modeler-field-library');
    });

    it('当字段库为空时应该返回空数组', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      const fields = loadFieldLibrary();
      expect(fields).toEqual([]);
    });

    it('应该能从字段库中删除字段', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockField]));
      removeFieldFromLibrary(mockField.id);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'db-modeler-field-library',
        JSON.stringify([])
      );
    });

    it('删除不存在的字段时不应该报错', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockField]));
      removeFieldFromLibrary('nonexistent');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'db-modeler-field-library',
        JSON.stringify([mockField])
      );
    });
  });

  describe('项目操作', () => {
    it('应该能保存项目', () => {
      saveProjects([mockProject]);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'db-modeler-projects',
        JSON.stringify([mockProject])
      );
    });

    it('应该能加载项目', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockProject]));
      const projects = loadProjects();
      expect(projects).toEqual([mockProject]);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('db-modeler-projects');
    });

    it('当项目为空时应该返回空数组', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      const projects = loadProjects();
      expect(projects).toEqual([]);
    });

    it('保存空项目列表时应该正常工作', () => {
      saveProjects([]);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'db-modeler-projects',
        JSON.stringify([])
      );
    });
  });

  describe('字段模板操作', () => {
    it('应该能加载字段模板', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockTemplate]));
      const templates = loadFieldTemplates();
      expect(templates).toEqual([mockTemplate]);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('db-modeler-field-templates');
    });

    it('应该能保存字段模板', () => {
      saveFieldTemplates([mockTemplate]);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'db-modeler-field-templates',
        JSON.stringify([mockTemplate])
      );
    });

    it('应该能添加字段模板', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([]));
      addFieldTemplate(mockTemplate);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'db-modeler-field-templates',
        JSON.stringify([mockTemplate])
      );
    });

    it('应该能更新字段模板', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockTemplate]));
      const updatedData = { name: '更新后的名称' };
      updateFieldTemplate(mockTemplate.id, updatedData);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'db-modeler-field-templates',
        JSON.stringify([{ ...mockTemplate, ...updatedData }])
      );
    });

    it('应该能删除字段模板', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockTemplate]));
      deleteFieldTemplate(mockTemplate.id);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'db-modeler-field-templates',
        JSON.stringify([])
      );
    });
  });

  describe('模板分类操作', () => {
    it('应该能加载默认模板分类', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      const categories = loadTemplateCategories();
      expect(categories.length).toBeGreaterThan(0);
      expect(categories[0].isBuiltin).toBe(true);
    });

    it('应该能保存模板分类', () => {
      saveTemplateCategories([mockCategory]);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'db-modeler-template-categories',
        JSON.stringify([mockCategory])
      );
    });

    it('应该能添加模板分类', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([]));
      addTemplateCategory(mockCategory);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'db-modeler-template-categories',
        JSON.stringify([mockCategory])
      );
    });

    it('应该能更新模板分类', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockCategory]));
      const updatedData = { name: '更新后的分类名称' };
      updateTemplateCategory(mockCategory.id, updatedData);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'db-modeler-template-categories',
        JSON.stringify([{ ...mockCategory, ...updatedData }])
      );
    });

    it('应该能删除模板分类', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockCategory]));
      deleteTemplateCategory(mockCategory.id);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'db-modeler-template-categories',
        JSON.stringify([])
      );
    });
  });
}); 