import { describe, it, expect, beforeEach } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import projectsReducer, {
  addProject,
  updateProject,
  deleteProject,
  addTable,
  addField,
  setCurrentProject,
  setError,
  setLoading,
  initializeState,
  persistMiddleware,
} from '../projectsSlice';
import type { Project, Field } from '../../types/models';
import { saveProjects } from '../../services/storage';

// Mock 外部依赖
jest.mock('../../services/storage', () => ({
  loadProjects: jest.fn(() => []),
  saveProjects: jest.fn(),
}));

// 类型定义
type RootState = {
  projects: ReturnType<typeof projectsReducer>;
};

// 测试数据准备
const mockProject: Project = {
  id: 'test-project',
  name: '测试项目',
  description: '这是一个测试项目',
  tables: [],
  createdAt: '2024-01-15T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
};

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
  name: '测试表',
  comment: '测试表注释',
  fields: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('项目状态管理', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        projects: projectsReducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persistMiddleware),
    });
    jest.clearAllMocks();
  });

  describe('初始化', () => {
    it('应该正确初始化状态', () => {
      store.dispatch(initializeState());
      const state = store.getState() as RootState;
      
      expect(state.projects.items).toEqual([]);
      expect(state.projects.loading).toBe(false);
      expect(state.projects.error).toBeNull();
      expect(state.projects.currentProject).toBeNull();
    });
  });

  describe('项目基本操作', () => {
    it('应该能添加新项目', () => {
      store.dispatch(addProject(mockProject));
      const state = store.getState() as RootState;
      
      expect(state.projects.items).toHaveLength(1);
      expect(state.projects.items[0].name).toBe(mockProject.name);
      expect(state.projects.items[0].description).toBe(mockProject.description);
      expect(state.projects.items[0].id).toBeDefined();
      expect(state.projects.items[0].tables).toEqual([]);
      expect(saveProjects).toHaveBeenCalled();
    });

    it('应该能更新现有项目', () => {
      store.dispatch(addProject(mockProject));
      const state = store.getState() as RootState;
      const projectId = state.projects.items[0].id;

      const updatedData = {
        name: '更新后的项目',
        description: '更新后的描述',
      };

      store.dispatch(updateProject({ id: projectId, data: updatedData }));
      const updatedState = store.getState() as RootState;
      
      expect(updatedState.projects.items[0].name).toBe(updatedData.name);
      expect(updatedState.projects.items[0].description).toBe(updatedData.description);
      expect(saveProjects).toHaveBeenCalledTimes(2);
    });

    it('应该能删除项目', () => {
      store.dispatch(addProject(mockProject));
      const state = store.getState() as RootState;
      const projectId = state.projects.items[0].id;

      store.dispatch(deleteProject(projectId));
      const updatedState = store.getState() as RootState;
      
      expect(updatedState.projects.items).toHaveLength(0);
      expect(saveProjects).toHaveBeenCalledTimes(2);
    });

    it('删除项目时应该清除当前项目（如果是被删除的项目）', () => {
      store.dispatch(addProject(mockProject));
      const state = store.getState() as RootState;
      const projectId = state.projects.items[0].id;

      store.dispatch(setCurrentProject(projectId));
      store.dispatch(deleteProject(projectId));
      const updatedState = store.getState() as RootState;
      
      expect(updatedState.projects.currentProject).toBeNull();
    });

    it('更新不存在的项目时不应该抛出错误', () => {
      const nonExistentId = 'non-existent-id';
      store.dispatch(updateProject({ 
        id: nonExistentId, 
        data: { name: '新名称' } 
      }));
      
      const state = store.getState() as RootState;
      expect(state.projects.items).toHaveLength(0);
      expect(state.projects.error).toBeNull();
    });
  });

  describe('状态管理', () => {
    it('应该能正确设置和清除加载状态', () => {
      store.dispatch(setLoading(true));
      expect((store.getState() as RootState).projects.loading).toBe(true);

      store.dispatch(setLoading(false));
      expect((store.getState() as RootState).projects.loading).toBe(false);
    });

    it('应该能正确设置和清除错误状态', () => {
      const errorMessage = '测试错误';
      store.dispatch(setError(errorMessage));
      expect((store.getState() as RootState).projects.error).toBe(errorMessage);

      store.dispatch(setError(null));
      expect((store.getState() as RootState).projects.error).toBeNull();
    });
  });

  describe('表操作', () => {
    it('应该能添加新表', () => {
      store.dispatch(addProject(mockProject));
      const state = store.getState() as RootState;
      const projectId = state.projects.items[0].id;

      store.dispatch(addTable({
        projectId,
        table: mockTable,
      }));

      const updatedState = store.getState() as RootState;
      const project = updatedState.projects.items[0];
      
      expect(project.tables).toHaveLength(1);
      expect(project.tables[0].name).toBe(mockTable.name);
      expect(project.tables[0].comment).toBe(mockTable.comment);
    });
  });

  describe('字段操作', () => {
    it('应该能添加新字段', () => {
      // 创建项目和表
      store.dispatch(addProject(mockProject));
      const state = store.getState() as RootState;
      const projectId = state.projects.items[0].id;

      store.dispatch(addTable({
        projectId,
        table: mockTable,
      }));

      const updatedState = store.getState() as RootState;
      const tableId = updatedState.projects.items[0].tables[0].id;

      // 添加字段
      store.dispatch(addField({
        projectId,
        tableId,
        field: mockField,
      }));

      const finalState = store.getState() as RootState;
      const field = finalState.projects.items[0].tables[0].fields[0];
      
      expect(field.name).toBe(mockField.name);
      expect(field.type).toBe(mockField.type);
      expect(field.nullable).toBe(mockField.nullable);
      expect(field.comment).toBe(mockField.comment);
      expect(field.isPrimaryKey).toBe(mockField.isPrimaryKey);
      expect(field.isAutoIncrement).toBe(mockField.isAutoIncrement);
      expect(field.unique).toBe(mockField.unique);
      expect(field.index).toBe(mockField.index);
      expect(field.unsigned).toBe(mockField.unsigned);
      expect(field.zerofill).toBe(mockField.zerofill);
      expect(field.length).toBe(mockField.length);
    });
  });
}); 