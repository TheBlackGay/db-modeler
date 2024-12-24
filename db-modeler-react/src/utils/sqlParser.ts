import type { Table, Field, Index } from '../types/models';
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

interface ParsedIndex {
  name: string;
  fields: string[];
  type: 'NORMAL' | 'UNIQUE' | 'FULLTEXT' | 'SPATIAL';
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

  // 提取表选项
  const engineMatch = ddl.match(/ENGINE\s*=\s*(\w+)/i);
  const charsetMatch = ddl.match(/(?:DEFAULT\s+)?CHARACTER\s+SET\s*=?\s*(\w+)/i);
  const collationMatch = ddl.match(/(?:DEFAULT\s+)?COLLATE\s*=?\s*(\w+(?:_\w+)*)/i);
  const autoIncrementMatch = ddl.match(/AUTO_INCREMENT\s*=\s*(\d+)/i);
  const rowFormatMatch = ddl.match(/ROW_FORMAT\s*=\s*(\w+)/i);
  const tableSpaceMatch = ddl.match(/TABLESPACE\s+(\w+)/i);

  // 提取字段定义
  const fieldsSection = ddl.substring(ddl.indexOf('(') + 1, ddl.lastIndexOf(')'));
  const fieldDefinitions = fieldsSection.split(',').map(f => f.trim()).filter(f => f);

  const fields: Field[] = [];
  const indexes: Index[] = [];
  const now = new Date().toISOString();

  // 解析每个字段
  for (const fieldDef of fieldDefinitions) {
    // 解析索引定义
    const indexMatch = fieldDef.match(/^(?:(UNIQUE|FULLTEXT|SPATIAL)\s+)?(?:KEY|INDEX)\s+[`"]?(\w+)[`"]?\s*\(([^)]+)\)/i);
    if (indexMatch) {
      const [, indexType, indexName, indexFields] = indexMatch;
      indexes.push({
        name: indexName,
        fields: indexFields.split(',').map(f => f.trim().replace(/[`"]/g, '')),
        type: (indexType?.toUpperCase() || 'NORMAL') as 'NORMAL' | 'UNIQUE' | 'FULLTEXT' | 'SPATIAL',
      });
      continue;
    }

    // 解析主键定义
    if (fieldDef.toUpperCase().startsWith('PRIMARY KEY')) {
      const primaryKeyFields = fieldDef.match(/PRIMARY\s+KEY\s*\(([^)]+)\)/i)?.[1];
      if (primaryKeyFields) {
        const pkFields = primaryKeyFields.split(',').map(f => f.trim().replace(/[`"]/g, ''));
        fields.forEach(field => {
          if (pkFields.includes(field.name)) {
            field.isPrimaryKey = true;
          }
        });
      }
      continue;
    }

    // 解析字段定义
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

  // 解析唯一键
  const uniqueMatches = fieldsSection.matchAll(/UNIQUE\s+(?:KEY|INDEX)?\s+[`"]?(\w+)[`"]?\s*\(([^)]+)\)/gi);
  for (const match of Array.from(uniqueMatches)) {
    const [, indexName, indexFields] = match;
    indexes.push({
      name: indexName || `uk_${generateId()}`,
      fields: indexFields.split(',').map(f => f.trim().replace(/[`"]/g, '')),
      type: 'UNIQUE',
    });
  }

  // 解析普通索引
  const indexMatches = fieldsSection.matchAll(/(?:KEY|INDEX)\s+[`"]?(\w+)[`"]?\s*\(([^)]+)\)/gi);
  for (const match of Array.from(indexMatches)) {
    const [, indexName, indexFields] = match;
    if (!indexes.some(idx => idx.name === indexName)) { // 避免重复添加
      indexes.push({
        name: indexName,
        fields: indexFields.split(',').map(f => f.trim().replace(/[`"]/g, '')),
        type: 'NORMAL',
      });
    }
  }

  // 解析全文索引
  const fulltextMatches = fieldsSection.matchAll(/FULLTEXT\s+(?:KEY|INDEX)?\s+[`"]?(\w+)[`"]?\s*\(([^)]+)\)/gi);
  for (const match of Array.from(fulltextMatches)) {
    const [, indexName, indexFields] = match;
    indexes.push({
      name: indexName || `ft_${generateId()}`,
      fields: indexFields.split(',').map(f => f.trim().replace(/[`"]/g, '')),
      type: 'FULLTEXT',
    });
  }

  // 解析空间索引
  const spatialMatches = fieldsSection.matchAll(/SPATIAL\s+(?:KEY|INDEX)?\s+[`"]?(\w+)[`"]?\s*\(([^)]+)\)/gi);
  for (const match of Array.from(spatialMatches)) {
    const [, indexName, indexFields] = match;
    indexes.push({
      name: indexName || `sp_${generateId()}`,
      fields: indexFields.split(',').map(f => f.trim().replace(/[`"]/g, '')),
      type: 'SPATIAL',
    });
  }

  return {
    id: generateId(),
    name: tableName,
    description: tableComment,
    fields,
    indexes,
    engine: engineMatch?.[1],
    charset: charsetMatch?.[1],
    collation: collationMatch?.[1],
    autoIncrement: autoIncrementMatch ? parseInt(autoIncrementMatch[1], 10) : undefined,
    rowFormat: rowFormatMatch?.[1],
    tableSpace: tableSpaceMatch?.[1],
    createdAt: now,
    updatedAt: now,
  };
}

function parseFieldDefinition(fieldDef: string): ParsedField | null {
  // 基本字段名和类型匹配
  const basicMatch = fieldDef.match(/^[`"]?(\w+)[`"]?\s+(\w+)(?:\((\d+(?:\s*,\s*\d+)?)\))?/i);
  if (!basicMatch) return null;

  const [, name, type, length] = basicMatch;
  const parsedField: ParsedField = {
    name,
    type: type.toUpperCase(),
    length: length ? parseInt(length.split(',')[0], 10) : undefined,
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