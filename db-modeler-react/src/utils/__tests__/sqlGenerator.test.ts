import { describe, it, expect } from '@jest/globals';
import { SQLGenerator } from '../sqlGenerator';
import type { Table } from '../../types/models';

describe('SQLGenerator', () => {
  const mockTable: Table = {
    id: '1',
    name: 'users',
    comment: '用户表',
    fields: [
      {
        id: '1',
        name: 'id',
        type: 'INT',
        length: 11,
        nullable: false,
        comment: '主键ID',
      },
      {
        id: '2',
        name: 'username',
        type: 'VARCHAR',
        length: 50,
        nullable: false,
        comment: '用户名',
      },
      {
        id: '3',
        name: 'email',
        type: 'VARCHAR',
        length: 100,
        nullable: true,
        defaultValue: null,
        comment: '邮箱',
      },
      {
        id: '4',
        name: 'created_at',
        type: 'TIMESTAMP',
        nullable: false,
        defaultValue: 'CURRENT_TIMESTAMP',
        comment: '创建时间',
      },
    ],
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  };

  describe('MySQL', () => {
    it('应该生成基本的MySQL建表语句', () => {
      const generator = new SQLGenerator({ dbType: 'mysql' });
      const sql = generator.generateTableSQL(mockTable);
      
      expect(sql).toContain('CREATE TABLE `users`');
      expect(sql).toContain('`id` INT(11) NOT NULL AUTO_INCREMENT');
      expect(sql).toContain('`username` VARCHAR(50) NOT NULL');
      expect(sql).toContain('`email` VARCHAR(100) NULL');
      expect(sql).toContain('`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP');
      expect(sql).toContain('ENGINE = InnoDB');
      expect(sql).toContain('DEFAULT CHARSET = utf8mb4');
      expect(sql).toContain('COLLATE = utf8mb4_unicode_ci');
    });

    it('应该正确处理注释选项', () => {
      const generator = new SQLGenerator({ dbType: 'mysql', includeComments: false });
      const sql = generator.generateTableSQL(mockTable);
      
      expect(sql).not.toContain('COMMENT');
      expect(sql).not.toContain('-- 用户表');
    });

    it('应该正确处理存储引擎选项', () => {
      const generator = new SQLGenerator({ dbType: 'mysql', engine: 'MyISAM' });
      const sql = generator.generateTableSQL(mockTable);
      
      expect(sql).toContain('ENGINE = MyISAM');
    });

    it('应该正确处理字符集选项', () => {
      const generator = new SQLGenerator({ 
        dbType: 'mysql', 
        charset: 'utf8', 
        collate: 'utf8_general_ci' 
      });
      const sql = generator.generateTableSQL(mockTable);
      
      expect(sql).toContain('DEFAULT CHARSET = utf8');
      expect(sql).toContain('COLLATE = utf8_general_ci');
    });

    it('应该正确处理自增选项', () => {
      const generator = new SQLGenerator({ dbType: 'mysql', autoIncrement: false });
      const sql = generator.generateTableSQL(mockTable);
      
      expect(sql).not.toContain('AUTO_INCREMENT');
    });
  });

  describe('PostgreSQL', () => {
    it('应该生成基本的PostgreSQL建表语句', () => {
      const generator = new SQLGenerator({ dbType: 'postgresql' });
      const sql = generator.generateTableSQL(mockTable);
      
      expect(sql).toContain('CREATE TABLE "users"');
      expect(sql).toContain('"id" INT NOT NULL GENERATED ALWAYS AS IDENTITY');
      expect(sql).toContain('"username" VARCHAR(50) NOT NULL');
      expect(sql).toContain('"email" VARCHAR(100) NULL');
      expect(sql).toContain('"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP');
      expect(sql).not.toContain('ENGINE =');
      expect(sql).not.toContain('CHARSET');
    });

    it('应该使用PostgreSQL风格的注释', () => {
      const generator = new SQLGenerator({ dbType: 'postgresql' });
      const sql = generator.generateTableSQL(mockTable);
      
      expect(sql).toContain('-- 用户表');
      expect(sql).toContain('-- 主键ID');
      expect(sql).not.toContain('COMMENT');
    });
  });

  describe('generateDatabaseSQL', () => {
    it('应该生成完整的数据库SQL（MySQL）', () => {
      const generator = new SQLGenerator({ dbType: 'mysql' });
      const sql = generator.generateDatabaseSQL([mockTable]);
      
      expect(sql).toContain('SET NAMES utf8mb4');
      expect(sql).toContain('SET FOREIGN_KEY_CHECKS = 0');
      expect(sql).toContain('CREATE TABLE');
      expect(sql).toContain('SET FOREIGN_KEY_CHECKS = 1');
    });

    it('应该生成完整的数据库SQL（PostgreSQL）', () => {
      const generator = new SQLGenerator({ dbType: 'postgresql' });
      const sql = generator.generateDatabaseSQL([mockTable]);
      
      expect(sql).not.toContain('SET NAMES');
      expect(sql).not.toContain('FOREIGN_KEY_CHECKS');
      expect(sql).toContain('CREATE TABLE');
    });
  });

  describe('主键和自增', () => {
    it('应该正确生成单一主键', () => {
      const table: Table = {
        id: '1',
        name: 'users',
        comment: '用户表',
        fields: [
          {
            id: '1',
            name: 'id',
            type: 'INT',
            nullable: false,
            isPrimaryKey: true,
            comment: '主键ID',
          }
        ],
        createdAt: '2024-01-15T00:00:00.000Z',
        updatedAt: '2024-01-15T00:00:00.000Z',
      };

      const sql = generator.generateTableSQL(table);
      expect(sql).toContain('`id` INT NOT NULL');
      expect(sql).toContain('PRIMARY KEY (`id`)');
    });

    it('应该正确生成复合主键', () => {
      const table: Table = {
        id: '1',
        name: 'order_items',
        comment: '订单项目表',
        fields: [
          {
            id: '1',
            name: 'order_id',
            type: 'INT',
            nullable: false,
            isPrimaryKey: true,
            comment: '订单ID',
          },
          {
            id: '2',
            name: 'product_id',
            type: 'INT',
            nullable: false,
            isPrimaryKey: true,
            comment: '产品ID',
          }
        ],
        createdAt: '2024-01-15T00:00:00.000Z',
        updatedAt: '2024-01-15T00:00:00.000Z',
      };

      const sql = generator.generateTableSQL(table);
      expect(sql).toContain('PRIMARY KEY (`order_id`, `product_id`)');
    });

    it('应该正确生成自增主键', () => {
      const table: Table = {
        id: '1',
        name: 'users',
        comment: '用户表',
        fields: [
          {
            id: '1',
            name: 'id',
            type: 'INT',
            nullable: false,
            isPrimaryKey: true,
            isAutoIncrement: true,
            comment: '主键ID',
          }
        ],
        createdAt: '2024-01-15T00:00:00.000Z',
        updatedAt: '2024-01-15T00:00:00.000Z',
      };

      const sql = generator.generateTableSQL(table);
      expect(sql).toContain('`id` INT NOT NULL AUTO_INCREMENT');
      expect(sql).toContain('PRIMARY KEY (`id`)');
    });

    it('应该在PostgreSQL中正确生成自增', () => {
      generator = new SQLGenerator({
        dbType: 'postgresql',
        includeComments: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
        engine: 'InnoDB',
        autoIncrement: true,
      });

      const table: Table = {
        id: '1',
        name: 'users',
        comment: '用户表',
        fields: [
          {
            id: '1',
            name: 'id',
            type: 'INT',
            nullable: false,
            isPrimaryKey: true,
            isAutoIncrement: true,
            comment: '主键ID',
          }
        ],
        createdAt: '2024-01-15T00:00:00.000Z',
        updatedAt: '2024-01-15T00:00:00.000Z',
      };

      const sql = generator.generateTableSQL(table);
      expect(sql).toContain('"id" INT NOT NULL GENERATED ALWAYS AS IDENTITY');
      expect(sql).toContain('PRIMARY KEY ("id")');
    });
  });
}); 