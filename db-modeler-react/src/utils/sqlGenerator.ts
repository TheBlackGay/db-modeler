import type { Table, Field } from '../types/models';

export type DatabaseType = 'mysql' | 'postgresql';

interface SQLGeneratorOptions {
  includeComments?: boolean;
  dbType?: DatabaseType;
  charset?: string;
  collate?: string;
  engine?: 'InnoDB' | 'MyISAM';
  autoIncrement?: boolean;
}

export class SQLGenerator {
  private dbType: DatabaseType;
  private includeComments: boolean;
  private charset: string;
  private collate: string;
  private engine: string;
  private autoIncrement: boolean;

  constructor(options: SQLGeneratorOptions = {}) {
    this.dbType = options.dbType || 'mysql';
    this.includeComments = options.includeComments ?? true;
    this.charset = options.charset || 'utf8mb4';
    this.collate = options.collate || 'utf8mb4_unicode_ci';
    this.engine = options.engine || 'InnoDB';
    this.autoIncrement = options.autoIncrement ?? true;
  }

  private getFieldType(field: Field): string {
    const type = field.type.toUpperCase();
    
    // PostgreSQL 不支持某些类型的长度参数
    if (this.dbType === 'postgresql') {
      if (['INT', 'BIGINT'].includes(type)) {
        return type;
      }
    }
    
    if (field.length && ['VARCHAR', 'CHAR', 'INT', 'BIGINT'].includes(type)) {
      return `${type}(${field.length})`;
    }
    return type;
  }

  private getFieldDefinition(field: Field): string {
    const parts: string[] = [];
    
    // 字段名
    parts.push(this.dbType === 'mysql' ? `\`${field.name}\`` : `"${field.name}"`);
    
    // 数据类型
    let typeStr = field.type;
    if (field.length && ['VARCHAR', 'INT', 'BIGINT', 'DECIMAL'].includes(field.type)) {
      typeStr += `(${field.length})`;
    }
    parts.push(typeStr);
    
    // 是否为空
    parts.push(field.nullable ? 'NULL' : 'NOT NULL');
    
    // 自增
    if (field.isAutoIncrement && ['INT', 'BIGINT'].includes(field.type.toUpperCase())) {
      parts.push(this.dbType === 'mysql' ? 'AUTO_INCREMENT' : 'GENERATED ALWAYS AS IDENTITY');
    }
    
    // 默认值
    if (field.defaultValue !== undefined && field.defaultValue !== null) {
      parts.push(`DEFAULT ${field.defaultValue}`);
    }
    
    return parts.join(' ');
  }

  private getCurrentTable(): Table | null {
    return this._currentTable || null;
  }

  private _currentTable: Table | null = null;

  generateTableSQL(table: Table): string {
    this._currentTable = table;
    const lines: string[] = [];
    
    // 添加建表注释
    if (this.includeComments && table.comment) {
      lines.push(`-- ${table.comment}`);
    }
    
    // 开始建表语句
    lines.push(`CREATE TABLE ${this.dbType === 'mysql' ? `\`${table.name}\`` : `"${table.name}"`} (`);
    
    // 添加字段定义
    const fieldLines = table.fields.map(field => {
      const fieldLine = `  ${this.getFieldDefinition(field)}`;
      if (this.includeComments && field.comment) {
        return this.dbType === 'mysql' 
          ? `${fieldLine} COMMENT '${field.comment}'`
          : `${fieldLine} -- ${field.comment}`;
      }
      return fieldLine;
    });
    
    // 添加主键
    const primaryKeys = table.fields.filter(field => field.isPrimaryKey);
    if (primaryKeys.length > 0) {
      const pkNames = primaryKeys.map(field => 
        this.dbType === 'mysql' ? `\`${field.name}\`` : `"${field.name}"`
      );
      fieldLines.push(`  PRIMARY KEY (${pkNames.join(', ')})`);
    }
    
    lines.push(fieldLines.join(',\n'));
    lines.push(')');
    
    // MySQL特有的表选项
    if (this.dbType === 'mysql') {
      const tableOptions = [];
      tableOptions.push(`ENGINE = ${this.engine}`);
      tableOptions.push(`DEFAULT CHARSET = ${this.charset}`);
      tableOptions.push(`COLLATE = ${this.collate}`);
      if (this.includeComments && table.comment) {
        tableOptions.push(`COMMENT = '${table.comment}'`);
      }
      lines.push(tableOptions.join('\n'));
    }
    
    lines.push(';');
    this._currentTable = null;
    return lines.join('\n');
  }

  generateDatabaseSQL(tables: Table[]): string {
    const lines = [];
    
    // 添加数据库选项（仅MySQL）
    if (this.dbType === 'mysql') {
      lines.push(`SET NAMES ${this.charset} COLLATE ${this.collate};`);
      lines.push('SET FOREIGN_KEY_CHECKS = 0;');
      lines.push('');
    }

    // 添加表定义
    lines.push(tables.map(table => this.generateTableSQL(table)).join('\n\n'));

    // 恢复数据库选项（仅MySQL）
    if (this.dbType === 'mysql') {
      lines.push('');
      lines.push('SET FOREIGN_KEY_CHECKS = 1;');
    }

    return lines.join('\n');
  }
} 