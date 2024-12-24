import type { Project } from '../types/models';

const now = new Date().toISOString();

const createField = (
  id: string,
  name: string,
  type: string,
  options: Partial<{
    length: number;
    precision: number;
    scale: number;
    nullable: boolean;
    isPrimaryKey: boolean;
    isAutoIncrement: boolean;
    unique: boolean;
    comment: string;
    index: boolean;
    unsigned: boolean;
    zerofill: boolean;
  }> = {}
) => ({
  id,
  name,
  type,
  nullable: options.nullable ?? false,
  isPrimaryKey: options.isPrimaryKey ?? false,
  isAutoIncrement: options.isAutoIncrement ?? false,
  unique: options.unique ?? false,
  comment: options.comment ?? '',
  index: options.index ?? false,
  unsigned: options.unsigned ?? false,
  zerofill: options.zerofill ?? false,
  length: options.length,
  precision: options.precision,
  scale: options.scale,
  createdAt: now,
  updatedAt: now,
});

export const mockProjects: Project[] = [
  {
    id: 'ecommerce-project',
    name: '电商系统',
    description: '包含用户、商品、订单等核心模块的数据库设计',
    tables: [
      {
        id: 'users-table',
        name: 'users',
        description: '用户表',
        fields: [
          createField('user-id-field', 'id', 'bigint', {
            isPrimaryKey: true,
            isAutoIncrement: true,
            unique: true,
            comment: '用户ID',
            unsigned: true,
          }),
          createField('username-field', 'username', 'varchar', {
            length: 50,
            unique: true,
            comment: '用户名',
            index: true,
          }),
          createField('email-field', 'email', 'varchar', {
            length: 100,
            unique: true,
            comment: '邮箱',
            index: true,
          }),
          createField('password-field', 'password', 'varchar', {
            length: 100,
            comment: '密码',
          }),
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'products-table',
        name: 'products',
        description: '商品表',
        fields: [
          createField('product-id-field', 'id', 'bigint', {
            isPrimaryKey: true,
            isAutoIncrement: true,
            unique: true,
            comment: '商品ID',
            unsigned: true,
          }),
          createField('product-name-field', 'name', 'varchar', {
            length: 100,
            comment: '商品名称',
            index: true,
          }),
          createField('product-price-field', 'price', 'decimal', {
            precision: 10,
            scale: 2,
            comment: '商品价格',
            unsigned: true,
          }),
        ],
        createdAt: now,
        updatedAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'blog-project',
    name: '博客系统',
    description: '包含文章、评论、标签等功能的博客数据库设计',
    tables: [
      {
        id: 'articles-table',
        name: 'articles',
        description: '文章表',
        fields: [
          createField('article-id-field', 'id', 'bigint', {
            isPrimaryKey: true,
            isAutoIncrement: true,
            unique: true,
            comment: '文章ID',
            unsigned: true,
          }),
          createField('article-title-field', 'title', 'varchar', {
            length: 200,
            comment: '文章标题',
            index: true,
          }),
          createField('article-content-field', 'content', 'text', {
            comment: '文章内容',
          }),
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'comments-table',
        name: 'comments',
        description: '评论表',
        fields: [
          createField('comment-id-field', 'id', 'bigint', {
            isPrimaryKey: true,
            isAutoIncrement: true,
            unique: true,
            comment: '评论ID',
            unsigned: true,
          }),
          createField('comment-article-id-field', 'article_id', 'bigint', {
            comment: '文章ID',
            index: true,
            unsigned: true,
          }),
          createField('comment-content-field', 'content', 'text', {
            comment: '评论内容',
          }),
        ],
        createdAt: now,
        updatedAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'education-project',
    name: '在线教育平台',
    description: '包含课程、学生、教师等模块的教育系统数据库设计',
    tables: [
      {
        id: 'courses-table',
        name: 'courses',
        description: '课程表',
        fields: [
          createField('course-id-field', 'id', 'bigint', {
            isPrimaryKey: true,
            isAutoIncrement: true,
            unique: true,
            comment: '课程ID',
            unsigned: true,
          }),
          createField('course-name-field', 'name', 'varchar', {
            length: 100,
            comment: '课程名称',
            index: true,
          }),
          createField('course-teacher-id-field', 'teacher_id', 'bigint', {
            comment: '教师ID',
            index: true,
            unsigned: true,
          }),
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'students-table',
        name: 'students',
        description: '学生表',
        fields: [
          createField('student-id-field', 'id', 'bigint', {
            isPrimaryKey: true,
            isAutoIncrement: true,
            unique: true,
            comment: '学生ID',
            unsigned: true,
          }),
          createField('student-name-field', 'name', 'varchar', {
            length: 50,
            comment: '学生姓名',
            index: true,
          }),
          createField('student-grade-field', 'grade', 'varchar', {
            length: 20,
            comment: '年级',
            index: true,
          }),
        ],
        createdAt: now,
        updatedAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
]; 