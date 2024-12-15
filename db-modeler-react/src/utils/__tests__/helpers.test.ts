import { describe, it, expect } from '@jest/globals';
import { generateId } from '../helpers';

describe('Helpers', () => {
  describe('generateId', () => {
    it('应该生成唯一的ID', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeDefined();
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
      expect(id1).not.toBe(id2);
    });

    it('应该生成不同的ID，即使在相同时间点', () => {
      const ids = new Set();
      for (let i = 0; i < 1000; i++) {
        ids.add(generateId());
      }
      expect(ids.size).toBe(1000);
    });

    it('生成的ID应该是有效的字符串', () => {
      const id = generateId();
      expect(id).toMatch(/^[a-z0-9]+$/);
    });
  });
}); 