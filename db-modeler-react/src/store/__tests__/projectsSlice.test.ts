import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import projectsReducer, {
  addProject,
  updateProject,
  deleteProject,
  addTable,
  addField,
  importProject,
  setCurrentProject,
  setError,
  setLoading,
  initializeState,
  persistMiddleware,
} from '../projectsSlice';
import type { Project } from '../../types/models';
import { saveProjects } from '../../services/storage';

// Mock storage service
jest.mock('../../services/storage', () => ({
  loadProjects: jest.fn(() => []),
  saveProjects: jest.fn(),
}));

type RootState = {
  projects: ReturnType<typeof projectsReducer>;
};

describe('Projects Slice', () => {
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

  const mockProject = {
    name: '测试项目',
    description: '这是一个测试项目',
  };

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

  describe('项目操作', () => {
    it('应该添加新项目', () => {
      store.dispatch(addProject(mockProject));
      const state = store.getState() as RootState;
      
      expect(state.projects.items).toHaveLength(1);
      expect(state.projects.items[0].name).toBe(mockProject.name);
      expect(state.projects.items[0].description).toBe(mockProject.description);
      expect(state.projects.items[0].id).toBeDefined();
      expect(state.projects.items[0].tables).toEqual([]);
      expect(saveProjects).toHaveBeenCalled();
    });

    it('应该更新现有项目', () => {
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

    it('应该删除项目', () => {
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

    it('应该正确设置和清除加载状态', () => {
      store.dispatch(setLoading(true));
      expect((store.getState() as RootState).projects.loading).toBe(true);

      store.dispatch(setLoading(false));
      expect((store.getState() as RootState).projects.loading).toBe(false);
    });

    it('应该正确设置和清除错误状态', () => {
      const errorMessage = '测试错误';
      store.dispatch(setError(errorMessage));
      expect((store.getState() as RootState).projects.error).toBe(errorMessage);

      store.dispatch(setError(null));
      expect((store.getState() as RootState).projects.error).toBeNull();
    });

    it('应该添加新项目并生成唯一ID', () => {
      // 添加两个项目，确保ID不重复
      store.dispatch(addProject(mockProject));
      store.dispatch(addProject(mockProject));
      const state = store.getState() as RootState;
      
      expect(state.projects.items).toHaveLength(2);
      expect(state.projects.items[0].id).not.toBe(state.projects.items[1].id);
    });

    it('新项目应该包含正确的时间戳', () => {
      store.dispatch(addProject(mockProject));
      const state = store.getState() as RootState;
      const project = state.projects.items[0];
      
      expect(new Date(project.createdAt).getTime()).toBeLessThanOrEqual(Date.now());
      expect(new Date(project.updatedAt).getTime()).toBeLessThanOrEqual(Date.now());
      expect(project.createdAt).toBe(project.updatedAt);
    });

    it('更新项目时应该更新时间戳', () => {
      store.dispatch(addProject(mockProject));
      const state = store.getState() as RootState;
      const project = state.projects.items[0];
      const originalUpdatedAt = project.updatedAt;

      // 等待一小段时间确保时间戳不同
      jest.advanceTimersByTime(1000);

      store.dispatch(updateProject({ 
        id: project.id, 
        data: { name: '新名称' } 
      }));
      
      const updatedState = store.getState() as RootState;
      const updatedProject = updatedState.projects.items[0];
      
      expect(updatedProject.updatedAt).not.toBe(originalUpdatedAt);
      expect(updatedProject.createdAt).toBe(project.createdAt);
    });

    it('批量操作时应该保持数据一致性', () => {
      // 添加多个项目
      const projects = [
        { name: '项目1', description: '描述1' },
        { name: '项目2', description: '描述2' },
        { name: '项目3', description: '描述3' },
      ];

      projects.forEach(project => {
        store.dispatch(addProject(project));
      });

      const state = store.getState() as RootState;
      expect(state.projects.items).toHaveLength(3);

      // 删除中间的项目
      const projectToDelete = state.projects.items[1].id;
      store.dispatch(deleteProject(projectToDelete));

      const updatedState = store.getState() as RootState;
      expect(updatedState.projects.items).toHaveLength(2);
      expect(updatedState.projects.items.map((p: Project) => p.name)).toEqual(['项目1', '项目3']);
    });
  });

  describe('项目状态管理', () => {
    it('应该正确设置当前项目', () => {
      store.dispatch(addProject(mockProject));
      const state = store.getState() as RootState;
      const projectId = state.projects.items[0].id;

      store.dispatch(setCurrentProject(projectId));
      const updatedState = store.getState() as RootState;
      
      expect(updatedState.projects.currentProject).not.toBeNull();
      expect(updatedState.projects.currentProject?.id).toBe(projectId);
    });

    it('设置不存在的项目ID时应该返回null', () => {
      store.dispatch(setCurrentProject('non-existent-id'));
      const state = store.getState() as RootState;
      
      expect(state.projects.currentProject).toBeNull();
    });
  });

  describe('表操作', () => {
    it('应该添加新表', () => {
      store.dispatch(addProject(mockProject));
      const state = store.getState() as RootState;
      const projectId = state.projects.items[0].id;

      store.dispatch(addTable({
        projectId,
        name: '测试表',
        comment: '测试表注释',
      }));

      const updatedState = store.getState() as RootState;
      const project = updatedState.projects.items[0];
      
      expect(project.tables).toHaveLength(1);
      expect(project.tables[0].name).toBe('测试表');
      expect(project.tables[0].comment).toBe('测试表注释');
    });
  });

  describe('字段操作', () => {
    it('应该添加新字段', () => {
      // 创建项目和表
      store.dispatch(addProject(mockProject));
      const state = store.getState() as RootState;
      const projectId = state.projects.items[0].id;

      store.dispatch(addTable({
        projectId,
        name: '测试表',
      }));

      const updatedState = store.getState() as RootState;
      const tableId = updatedState.projects.items[0].tables[0].id;

      // 添加字段
      store.dispatch(addField({
        projectId,
        tableId,
        field: {
          name: 'id',
          type: 'INT',
          nullable: false,
          comment: '主键',
        },
      }));

      const finalState = store.getState() as RootState;
      const field = finalState.projects.items[0].tables[0].fields[0];
      
      expect(field.name).toBe('id');
      expect(field.type).toBe('INT');
      expect(field.nullable).toBe(false);
      expect(field.comment).toBe('主键');
    });
  });

  describe('导入导出', () => {
    it('应该导入项目', () => {
      const importedProject: Project = {
        id: '123',
        name: '导入的项目',
        description: '这是一个导入的项目',
        tables: [],
        createdAt: '2023-12-15T00:00:00.000Z',
        updatedAt: '2023-12-15T00:00:00.000Z',
      };

      store.dispatch(importProject(importedProject));
      const state = store.getState() as RootState;
      
      expect(state.projects.items).toHaveLength(1);
      expect(state.projects.items[0].id).toBe(importedProject.id);
      expect(state.projects.items[0].name).toBe(importedProject.name);
    });

    it('应该更新已存在的导入项目', () => {
      const existingProject: Project = {
        id: '123',
        name: '现有项目',
        description: '这是一个现有项目',
        tables: [],
        createdAt: '2023-12-15T00:00:00.000Z',
        updatedAt: '2023-12-15T00:00:00.000Z',
      };

      store.dispatch(importProject(existingProject));
      
      const updatedProject: Project = {
        ...existingProject,
        name: '更新后的项目',
        description: '这是更新后的项目',
      };

      store.dispatch(importProject(updatedProject));
      const state = store.getState() as RootState;
      
      expect(state.projects.items).toHaveLength(1);
      expect(state.projects.items[0].name).toBe(updatedProject.name);
      expect(state.projects.items[0].description).toBe(updatedProject.description);
    });
  });
}); 