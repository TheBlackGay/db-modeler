import type { Table, Field } from '../types/models';
import { generateId } from './helpers';

interface ParsedField {
  name: string;
  type: string;
  length?: number;
  nullable: boolean;
  defaultValue?: string;
  comment?: string;
  isPrimaryKey: boolean;
  isAutoIncrement: boolean;
  unique: boolean;
  index: boolean;
  unsigned: boolean;
  zerofill: boolean;
}

export function parseDDL(ddl: string): Table {
  // 移除注释
  ddl = ddl.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  
  // 提取表名
  const tableNameMatch = ddl.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?([^`"\s(]+)[`"]?\s*\(/i);
  if (!tableNameMatch) {
    throw new Error('无法解析表名');
  }
  const tableName = tableNameMatch[1];

  // 提取表注释
  const tableCommentMatch = ddl.match(/COMMENT\s*=\s*'([^']+)'/i);
  const tableComment = tableCommentMatch ? tableCommentMatch[1] : undefined;

  // 提取字段定义
  const fieldsSection = ddl.substring(ddl.indexOf('(') + 1, ddl.lastIndexOf(')'));
  const fieldDefinitions = fieldsSection.split(',').map(f => f.trim()).filter(f => f);

  const fields: Field[] = [];
  const now = new Date().toISOString();

  // 解析每个字段
  for (const fieldDef of fieldDefinitions) {
    // 跳过主键、唯一键和索引定义
    if (fieldDef.toUpperCase().startsWith('PRIMARY KEY') ||
        fieldDef.toUpperCase().startsWith('UNIQUE') ||
        fieldDef.toUpperCase().startsWith('KEY') ||
        fieldDef.toUpperCase().startsWith('INDEX')) {
      continue;
    }

    const parsedField = parseFieldDefinition(fieldDef);
    if (parsedField) {
      fields.push({
        id: generateId(),
        ...parsedField,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  // 解析主键
  const primaryKeyMatch = fieldsSection.match(/PRIMARY\s+KEY\s*\(([^)]+)\)/i);
  if (primaryKeyMatch) {
    const primaryKeys = primaryKeyMatch[1].split(',').map(k => k.trim().replace(/[`"]/g, ''));
    fields.forEach(field => {
      if (primaryKeys.includes(field.name)) {
        field.isPrimaryKey = true;
      }
    });
  }

  // 解析唯一键
  const uniqueMatches = fieldsSection.matchAll(/UNIQUE\s+(?:KEY\s+[`"]?\w+[`"]?\s*)?\(([^)]+)\)/gi);
  for (const match of uniqueMatches) {
    const uniqueFields = match[1].split(',').map(k => k.trim().replace(/[`"]/g, ''));
    fields.forEach(field => {
      if (uniqueFields.includes(field.name)) {
        field.unique = true;
      }
    });
  }

  // 解析普通索引
  const indexMatches = fieldsSection.matchAll(/(?:KEY|INDEX)\s+[`"]?\w+[`"]?\s*\(([^)]+)\)/gi);
  for (const match of indexMatches) {
    const indexFields = match[1].split(',').map(k => k.trim().replace(/[`"]/g, ''));
    fields.forEach(field => {
      if (indexFields.includes(field.name)) {
        field.index = true;
      }
    });
  }

  return {
    id: generateId(),
    name: tableName,
    description: tableComment,
    fields,
    createdAt: now,
    updatedAt: now,
  };
}

function parseFieldDefinition(fieldDef: string): ParsedField | null {
  // 基本字段名和类型匹配
  const basicMatch = fieldDef.match(/^[`"]?(\w+)[`"]?\s+(\w+)(?:\((\d+)\))?/i);
  if (!basicMatch) return null;

  const [, name, type, length] = basicMatch;
  const parsedField: ParsedField = {
    name,
    type: type.toUpperCase(),
    length: length ? parseInt(length, 10) : undefined,
    nullable: !fieldDef.includes('NOT NULL'),
    isPrimaryKey: false,
    isAutoIncrement: fieldDef.toUpperCase().includes('AUTO_INCREMENT'),
    unique: false,
    index: false,
    unsigned: fieldDef.toUpperCase().includes('UNSIGNED'),
    zerofill: fieldDef.toUpperCase().includes('ZEROFILL'),
  };

  // 解析默认值
  const defaultMatch = fieldDef.match(/DEFAULT\s+(?:'([^']+)'|(\d+)|(\w+))/i);
  if (defaultMatch) {
    parsedField.defaultValue = defaultMatch[1] || defaultMatch[2] || defaultMatch[3];
  }

  // 解析注释
  const commentMatch = fieldDef.match(/COMMENT\s+'([^']+)'/i);
  if (commentMatch) {
    parsedField.comment = commentMatch[1];
  }

  return parsedField;
}

export function parseBatchDDL(ddl: string): Table[] {
  // 移除注释
  ddl = ddl.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  
  // 按照 CREATE TABLE 语句分割
  const statements = ddl.split(/;(?:\r?\n|$)/).map(s => s.trim()).filter(s => s);
  const tables: Table[] = [];

  for (const statement of statements) {
    if (statement.toUpperCase().startsWith('CREATE TABLE')) {
      try {
        const table = parseDDL(statement + ';');
        tables.push(table);
      } catch (error) {
        console.error('解析表结构失败:', error);
        // 继续解析下一个表
      }
    }
  }

  return tables;
} 