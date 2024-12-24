import type { Table, Field } from '../types/models';

interface SQLGeneratorOptions {
  dialect: 'mysql' | 'postgresql' | 'sqlite';
  version: string;
  includeDropTable: boolean;
  includeIfNotExists: boolean;
  includeComments: boolean;
  includeAutoIncrement: boolean;
  includeCharset: boolean;
  charset: string;
  collation: string;
}

export function generateSQLScript(table: Table, options: SQLGeneratorOptions): string {
  const lines: string[] = [];
  
  // 添加注释
  if (options.includeComments) {
    lines.push(`-- ${table.name} 表结构`);
    if (table.description) {
      lines.push(`-- ${table.description}`);
    }
    lines.push('');
  }

  // DROP TABLE语句
  if (options.includeDropTable) {
    if (options.dialect === 'mysql') {
      lines.push(`DROP TABLE IF EXISTS \`${table.name}\`;`);
    } else if (options.dialect === 'postgresql') {
      lines.push(`DROP TABLE IF EXISTS "${table.name}";`);
    } else {
      lines.push(`DROP TABLE IF EXISTS ${table.name};`);
    }
    lines.push('');
  }

  // CREATE TABLE语句
  let createTableLine = 'CREATE TABLE ';
  if (options.includeIfNotExists) {
    createTableLine += 'IF NOT EXISTS ';
  }

  if (options.dialect === 'mysql') {
    createTableLine += `\`${table.name}\` (`;
  } else if (options.dialect === 'postgresql') {
    createTableLine += `"${table.name}" (`;
  } else {
    createTableLine += `${table.name} (`;
  }
  lines.push(createTableLine);

  // 字段定义
  const fieldLines = table.fields.map(field => {
    let line = '';
    
    // 字段名
    if (options.dialect === 'mysql') {
      line += `  \`${field.name}\``;
    } else if (options.dialect === 'postgresql') {
      line += `  "${field.name}"`;
    } else {
      line += `  ${field.name}`;
    }

    // 字段类型
    line += ` ${getFieldType(field, options)}`;

    // 是否可空
    if (!field.nullable) {
      line += ' NOT NULL';
    }

    // 默认值
    if (field.defaultValue !== undefined && field.defaultValue !== '') {
      line += ` DEFAULT ${formatDefaultValue(field.defaultValue, field.type)}`;
    }

    // 自增
    if (field.isAutoIncrement && options.includeAutoIncrement) {
      if (options.dialect === 'mysql') {
        line += ' AUTO_INCREMENT';
      } else if (options.dialect === 'postgresql') {
        // PostgreSQL使用SERIAL类型代替AUTO_INCREMENT
      }
    }

    // 注释
    if (options.includeComments && field.comment && options.dialect === 'mysql') {
      line += ` COMMENT '${field.comment.replace(/'/g, "''")}'`;
    }

    return line;
  });

  // 主键约束
  const primaryKeys = table.fields.filter(f => f.isPrimaryKey).map(f => {
    if (options.dialect === 'mysql') {
      return `\`${f.name}\``;
    } else if (options.dialect === 'postgresql') {
      return `"${f.name}"`;
    }
    return f.name;
  });

  if (primaryKeys.length > 0) {
    fieldLines.push(`  PRIMARY KEY (${primaryKeys.join(', ')})`);
  }

  // 唯一约束
  table.fields.forEach(field => {
    if (field.unique && !field.isPrimaryKey) {
      if (options.dialect === 'mysql') {
        fieldLines.push(`  UNIQUE KEY \`uk_${field.name}\` (\`${field.name}\`)`);
      } else if (options.dialect === 'postgresql') {
        fieldLines.push(`  UNIQUE ("${field.name}")`);
      } else {
        fieldLines.push(`  UNIQUE (${field.name})`);
      }
    }
  });

  // 索引
  table.fields.forEach(field => {
    if (field.index && !field.unique && !field.isPrimaryKey) {
      if (options.dialect === 'mysql') {
        fieldLines.push(`  KEY \`idx_${field.name}\` (\`${field.name}\`)`);
      } else if (options.dialect === 'postgresql') {
        // PostgreSQL的索引在表外创建
        lines.push(`CREATE INDEX "idx_${table.name}_${field.name}" ON "${table.name}" ("${field.name}");`);
      } else {
        lines.push(`CREATE INDEX idx_${table.name}_${field.name} ON ${table.name} (${field.name});`);
      }
    }
  });

  lines.push(fieldLines.join(',\n'));

  // 表选项
  if (options.dialect === 'mysql') {
    const tableOptions: string[] = [];
    
    if (options.includeCharset) {
      tableOptions.push(`CHARACTER SET = ${options.charset}`);
      tableOptions.push(`COLLATE = ${options.collation}`);
    }

    if (options.includeComments && table.description) {
      tableOptions.push(`COMMENT = '${table.description.replace(/'/g, "''")}'`);
    }

    if (tableOptions.length > 0) {
      lines.push(`) ${tableOptions.join(' ')};`);
    } else {
      lines.push(');');
    }
  } else {
    lines.push(');');
  }

  // PostgreSQL的注释
  if (options.dialect === 'postgresql' && options.includeComments) {
    if (table.description) {
      lines.push('');
      lines.push(`COMMENT ON TABLE "${table.name}" IS '${table.description.replace(/'/g, "''")}';`);
    }

    table.fields.forEach(field => {
      if (field.comment) {
        lines.push(`COMMENT ON COLUMN "${table.name}"."${field.name}" IS '${field.comment.replace(/'/g, "''")}';`);
      }
    });
  }

  return lines.join('\n');
}

function getFieldType(field: Field, options: SQLGeneratorOptions): string {
  const { type, length, unsigned, zerofill } = field;
  
  if (options.dialect === 'mysql') {
    let fieldType = type;
    
    if (length) {
      fieldType += `(${length})`;
    }
    
    if (unsigned) {
      fieldType += ' UNSIGNED';
    }
    
    if (zerofill) {
      fieldType += ' ZEROFILL';
    }
    
    return fieldType;
  } else if (options.dialect === 'postgresql') {
    switch (type) {
      case 'INT':
        return field.isAutoIncrement ? 'SERIAL' : 'INTEGER';
      case 'VARCHAR':
        return `VARCHAR(${length || 255})`;
      case 'TEXT':
        return 'TEXT';
      case 'DATETIME':
        return 'TIMESTAMP';
      case 'DECIMAL':
        return `DECIMAL(${length || '10,2'})`;
      default:
        return type;
    }
  } else {
    // SQLite
    switch (type) {
      case 'INT':
        return 'INTEGER';
      case 'VARCHAR':
        return 'TEXT';
      case 'TEXT':
        return 'TEXT';
      case 'DATETIME':
        return 'DATETIME';
      case 'DECIMAL':
        return 'REAL';
      default:
        return type;
    }
  }
}

function formatDefaultValue(value: string, type: string): string {
  if (value.toUpperCase() === 'NULL') {
    return 'NULL';
  }
  
  if (value.toUpperCase() === 'CURRENT_TIMESTAMP') {
    return 'CURRENT_TIMESTAMP';
  }
  
  if (type === 'INT' || type === 'DECIMAL') {
    return value;
  }
  
  return `'${value.replace(/'/g, "''")}'`;
}

export function generateBatchSQLScript(tables: Table[], options: SQLGeneratorOptions): string {
  const lines: string[] = [];
  
  // 添加批量导出注释
  if (options.includeComments) {
    lines.push(`-- 批量导出表结构`);
    lines.push(`-- 导出时间: ${new Date().toISOString()}`);
    lines.push(`-- 数据库类型: ${options.dialect.toUpperCase()}`);
    lines.push('');
  }
  
  // 生成每个表的SQL
  for (const table of tables) {
    lines.push(generateSQLScript(table, options));
    lines.push(''); // 添加空行分隔
  }
  
  return lines.join('\n');
} 