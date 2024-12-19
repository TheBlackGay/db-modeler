import { describe, it, expect } from '@jest/globals';
import { generateSQLScript } from '../sqlGenerator';
import type { Table, Field } from '../../types/models';

// 测试数据准备
const mockFields: Field[] = [
  {
    id: '1',
    name: 'id',
    type: 'INT',
    nullable: false,
    isPrimaryKey: true,
    isAutoIncrement: true,
    unique: false,
    index: false,
    comment: '用户ID',
    defaultValue: '',
    length: undefined,
    unsigned: true,
    zerofill: false,
  },
  {
    id: '2',
    name: 'username',
    type: 'VARCHAR',
    nullable: false,
    isPrimaryKey: false,
    isAutoIncrement: false,
    unique: true,
    index: false,
    comment: '用户名',
    defaultValue: '',
    length: 50,
    unsigned: false,
    zerofill: false,
  },
  {
    id: '3',
    name: 'created_at',
    type: 'DATETIME',
    nullable: false,
    isPrimaryKey: false,
    isAutoIncrement: false,
    unique: false,
    index: true,
    comment: '创建时间',
    defaultValue: 'CURRENT_TIMESTAMP',
    length: undefined,
    unsigned: false,
    zerofill: false,
  }
];

const mockTable: Table = {
  id: '1',
  name: 'users',
  comment: '用户表',
  fields: mockFields,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const defaultOptions = {
  dialect: 'mysql' as const,
  version: '8.0',
  includeDropTable: true,
  includeIfNotExists: true,
  includeComments: true,
  includeAutoIncrement: true,
  includeCharset: true,
  charset: 'utf8mb4',
  collation: 'utf8mb4_unicode_ci'
};

describe('SQL生成器', () => {
  describe('MySQL语法', () => {
    it('应该能生成基本的MySQL表结构', () => {
      const sql = generateSQLScript(mockTable, defaultOptions);
      expect(sql).toContain('CREATE TABLE IF NOT EXISTS `users`');
      expect(sql).toContain('`id` INT UNSIGNED NOT NULL AUTO_INCREMENT');
      expect(sql).toContain('`username` VARCHAR(50) NOT NULL');
      expect(sql).toContain('PRIMARY KEY (`id`)');
      expect(sql).toContain('UNIQUE KEY `uk_username` (`username`)');
      expect(sql).toContain('KEY `idx_created_at` (`created_at`)');
    });
  });

  describe('PostgreSQL语法', () => {
    it('应该能生成PostgreSQL表结构', () => {
      const sql = generateSQLScript(mockTable, {
        ...defaultOptions,
        dialect: 'postgresql'
      });
      expect(sql).toContain('CREATE TABLE IF NOT EXISTS "users"');
      expect(sql).toContain('"id" SERIAL NOT NULL');
      expect(sql).toContain('"username" VARCHAR(50) NOT NULL');
      expect(sql).toContain('PRIMARY KEY ("id")');
      expect(sql).toContain('UNIQUE ("username")');
      expect(sql).toContain('CREATE INDEX "idx_users_created_at" ON "users" ("created_at");');
    });
  });

  describe('SQLite语法', () => {
    it('应该能生成SQLite表结构', () => {
      const sql = generateSQLScript(mockTable, {
        ...defaultOptions,
        dialect: 'sqlite'
      });
      expect(sql).toContain('CREATE TABLE IF NOT EXISTS users');
      expect(sql).toContain('id INTEGER NOT NULL');
      expect(sql).toContain('username TEXT NOT NULL');
      expect(sql).toContain('PRIMARY KEY (id)');
      expect(sql).toContain('UNIQUE (username)');
      expect(sql).toContain('CREATE INDEX idx_users_created_at ON users (created_at);');
    });
  });

  describe('选项控制', () => {
    it('应该能控制DROP TABLE语句的生成', () => {
      const sql = generateSQLScript(mockTable, {
        ...defaultOptions,
        includeDropTable: false
      });
      expect(sql).not.toContain('DROP TABLE');
    });

    it('应该能控制IF NOT EXISTS语句的生成', () => {
      const sql = generateSQLScript(mockTable, {
        ...defaultOptions,
        includeIfNotExists: false
      });
      expect(sql).not.toContain('IF NOT EXISTS');
    });

    it('应该能控制注释的生成', () => {
      const sql = generateSQLScript(mockTable, {
        ...defaultOptions,
        includeComments: false
      });
      expect(sql).not.toContain('COMMENT');
    });

    it('应该能控制自增长属性的生成', () => {
      const sql = generateSQLScript(mockTable, {
        ...defaultOptions,
        includeAutoIncrement: false
      });
      expect(sql).not.toContain('AUTO_INCREMENT');
    });

    it('应该能控制字符集设置的生成', () => {
      const sql = generateSQLScript(mockTable, {
        ...defaultOptions,
        includeCharset: false
      });
      expect(sql).not.toContain('CHARACTER SET');
      expect(sql).not.toContain('COLLATE');
    });
  });
}); 