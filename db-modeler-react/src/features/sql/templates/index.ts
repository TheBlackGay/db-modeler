import type { SQLTemplate } from './types';

// 内置模板
export const builtinTemplates: SQLTemplate[] = [
  {
    id: 'select-all',
    name: '查询所有数据',
    description: '查询表中的所有数据',
    content: 'SELECT * FROM ${tableName}',
    dialect: 'mysql',
    variables: [
      {
        name: 'tableName',
        description: '表名',
        type: 'string',
      },
    ],
    categoryId: 'general',
    isBuiltin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'insert-data',
    name: '插入数据',
    description: '向表中插入数据',
    content: 'INSERT INTO ${tableName} (${columns}) VALUES (${values})',
    dialect: 'mysql',
    variables: [
      {
        name: 'tableName',
        description: '表名',
        type: 'string',
      },
      {
        name: 'columns',
        description: '列名，用逗号分隔',
        type: 'string',
      },
      {
        name: 'values',
        description: '值，用逗号分隔',
        type: 'string',
      },
    ],
    categoryId: 'general',
    isBuiltin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'update-data',
    name: '更新数据',
    description: '更新表中的数据',
    content: 'UPDATE ${tableName} SET ${setClause} WHERE ${condition}',
    dialect: 'mysql',
    variables: [
      {
        name: 'tableName',
        description: '表名',
        type: 'string',
      },
      {
        name: 'setClause',
        description: '设置子句，如 column1 = value1, column2 = value2',
        type: 'string',
      },
      {
        name: 'condition',
        description: '条件子句',
        type: 'string',
      },
    ],
    categoryId: 'general',
    isBuiltin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'delete-data',
    name: '删除数据',
    description: '删除表中的数据',
    content: 'DELETE FROM ${tableName} WHERE ${condition}',
    dialect: 'mysql',
    variables: [
      {
        name: 'tableName',
        description: '表名',
        type: 'string',
      },
      {
        name: 'condition',
        description: '条件子句',
        type: 'string',
      },
    ],
    categoryId: 'general',
    isBuiltin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 渲染模板
export const renderTemplate = (
  template: SQLTemplate,
  variables: Record<string, string>
): string => {
  let sql = template.content;
  for (const [key, value] of Object.entries(variables)) {
    sql = sql.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value);
  }
  return sql;
}; 