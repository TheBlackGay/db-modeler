import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { loadProjects, saveProjects, exportProject, importProject } from '../storage';
import type { Project } from '../../types/models';

describe('Storage Service', () => {
  const mockProject: Project = {
    id: '1',
    name: '测试项目',
    description: '这是一个测试项目',
    tables: [],
    createdAt: '2023-12-15T00:00:00.000Z',
    updatedAt: '2023-12-15T00:00:00.000Z',
  };

  beforeEach(() => {
    // 清除所有 mock 的调用记录
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('loadProjects', () => {
    it('应该从 localStorage 加载项目', () => {
      const mockData = JSON.stringify([mockProject]);
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(mockData);

      const result = loadProjects();
      expect(result).toEqual([mockProject]);
      expect(localStorage.getItem).toHaveBeenCalledWith('db_modeler_projects');
    });

    it('如果 localStorage 为空应该返回空数组', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

      const result = loadProjects();
      expect(result).toEqual([]);
    });

    it('如果数据无效应该返回空数组', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('invalid json');

      const result = loadProjects();
      expect(result).toEqual([]);
    });

    it('应该处理包含特殊字符的项目数据', () => {
      const projectWithSpecialChars: Project = {
        ...mockProject,
        name: '测试项目 #$%^&*',
        description: '包含特殊字符 !@#$%^&*()',
      };
      const mockData = JSON.stringify([projectWithSpecialChars]);
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(mockData);

      const result = loadProjects();
      expect(result).toEqual([projectWithSpecialChars]);
    });
  });

  describe('saveProjects', () => {
    it('应该将项目保存到 localStorage', () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      
      saveProjects([mockProject]);
      expect(setItemSpy).toHaveBeenCalledWith(
        'db_modeler_projects',
        JSON.stringify([mockProject])
      );
    });

    it('应该处理空数组', () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      
      saveProjects([]);
      expect(setItemSpy).toHaveBeenCalledWith(
        'db_modeler_projects',
        '[]'
      );
    });

    it('保存失败时应该记录错误', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('存储错误');
      });

      saveProjects([mockProject]);
      expect(consoleSpy).toHaveBeenCalledWith('保存项目数据失败:', expect.any(Error));
    });
  });

  describe('exportProject', () => {
    let createElementSpy: ReturnType<typeof jest.spyOn>;
    let clickSpy: ReturnType<typeof jest.fn>;

    beforeEach(() => {
      clickSpy = jest.fn();
      createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(
        () => ({
          setAttribute: jest.fn(),
          click: clickSpy,
        } as unknown as HTMLElement)
      );
    });

    afterEach(() => {
      createElementSpy.mockRestore();
    });

    it('应该创建下载链接并触发点击', () => {
      exportProject(mockProject);
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(clickSpy).toHaveBeenCalled();
    });

    it('导出失败时应该抛出错误', () => {
      createElementSpy.mockImplementation(() => {
        throw new Error('模拟错误');
      });

      expect(() => exportProject(mockProject)).toThrow('导出项目失败');
    });

    it('应该生成正确的文件名', () => {
      const setAttributeSpy = jest.fn();
      createElementSpy.mockImplementation(
        () => ({
          setAttribute: setAttributeSpy,
          click: clickSpy,
        } as unknown as HTMLElement)
      );

      exportProject(mockProject);
      expect(setAttributeSpy).toHaveBeenCalledWith(
        'download',
        expect.stringMatching(/^测试项目_\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\.json$/)
      );
    });
  });

  describe('importProject', () => {
    it('应该正确解析有效的项目文件', async () => {
      const file = new File(
        [JSON.stringify(mockProject)],
        'test-project.json',
        { type: 'application/json' }
      );

      const result = await importProject(file);
      expect(result).toEqual(mockProject);
    });

    it('应该拒绝无效的项目文件', async () => {
      const invalidFile = new File(
        ['invalid json'],
        'invalid-project.json',
        { type: 'application/json' }
      );

      await expect(importProject(invalidFile)).rejects.toThrow('解析项目文件失败');
    });

    it('应该验证项目数据结构', async () => {
      const invalidProject = { name: '测试项目' }; // 缺少必要字段
      const file = new File(
        [JSON.stringify(invalidProject)],
        'invalid-project.json',
        { type: 'application/json' }
      );

      await expect(importProject(file)).rejects.toThrow('解析项目文件失败');
    });

    it('应该处理大型项目文件', async () => {
      const largeProject: Project = {
        ...mockProject,
        tables: Array(100).fill(null).map((_, index) => ({
          id: `table-${index}`,
          name: `Table ${index}`,
          fields: Array(20).fill(null).map((_, fieldIndex) => ({
            id: `field-${index}-${fieldIndex}`,
            name: `Field ${fieldIndex}`,
            type: 'VARCHAR',
            nullable: false,
          })),
          comment: `Table ${index} comment`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
      };

      const file = new File(
        [JSON.stringify(largeProject)],
        'large-project.json',
        { type: 'application/json' }
      );

      const result = await importProject(file);
      expect(result).toEqual(largeProject);
    });

    it('应该处理包含所有可选字段的项目', async () => {
      const fullProject: Project = {
        ...mockProject,
        tables: [{
          id: 'table-1',
          name: 'Test Table',
          fields: [{
            id: 'field-1',
            name: 'test_field',
            type: 'VARCHAR',
            length: 255,
            nullable: true,
            defaultValue: 'test',
            comment: 'Test field comment',
          }],
          comment: 'Test table comment',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }],
      };

      const file = new File(
        [JSON.stringify(fullProject)],
        'full-project.json',
        { type: 'application/json' }
      );

      const result = await importProject(file);
      expect(result).toEqual(fullProject);
    });
  });
}); 