// 数据库相关类型
export interface IField {
  id: string;
  name: string;
  type: string;
  length?: number;
  isPrimaryKey: boolean;
  isAutoIncrement: boolean;
  isNullable: boolean;
  defaultValue?: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITable {
  id: string;
  name: string;
  comment?: string;
  fields: IField[];
  createdAt: string;
  updatedAt: string;
}

export interface IConnection {
  id: string;
  name: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface IApi {
  id: string;
  name: string;
  description?: string;
  method: string;
  path: string;
  parameters?: {
    query?: Array<{
      name: string;
      type: string;
      required: boolean;
      description?: string;
    }>;
    body?: {
      type: string;
      properties: Record<string, {
        type: string;
        description?: string;
        required?: boolean;
      }>;
    };
  };
  responses?: Record<string, {
    description: string;
    content?: {
      'application/json': {
        schema: any;
      };
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

// 项目设置类型
export interface IProjectSettings {
  theme: {
    darkMode: boolean;
    primaryColor: string;
    compactMode: boolean;
  };
  database: {
    connectionTimeout: number;
    maxConnections: number;
    defaultDatabase: string;
    sslEnabled: boolean;
  };
  export: {
    indentStyle: 'space' | 'tab';
    indentSize: number;
    lineEnding: 'lf' | 'crlf';
    upperCase: boolean;
  };
}

// 项目类型
export interface IProject {
  id: string;
  name: string;
  description: string;
  tables: ITable[];
  connections: IConnection[];
  apis: IApi[];
  settings: IProjectSettings;
  createdAt: string;
  updatedAt: string;
}

// 字段类型选项
export const fieldTypes = [
  { label: '整数', value: 'int', description: '4字节整数，范围：-2^31 ~ 2^31-1' },
  { label: '长整数', value: 'bigint', description: '8字节整数，范围：-2^63 ~ 2^63-1' },
  { label: '小整数', value: 'smallint', description: '2字节整数，范围：-32768 ~ 32767' },
  { label: '单精度浮点', value: 'float', description: '4字节浮点数' },
  { label: '双精度浮点', value: 'double', description: '8字节浮点数' },
  { label: '定点数', value: 'decimal', description: '精确的小数，用于金额等' },
  { label: '字符串', value: 'varchar', description: '变长字符串' },
  { label: '文本', value: 'text', description: '长文本' },
  { label: '日期', value: 'date', description: '日期，格式：YYYY-MM-DD' },
  { label: '时间', value: 'time', description: '时间，格式：HH:mm:ss' },
  { label: '日期时间', value: 'datetime', description: '日期和时间，格式：YYYY-MM-DD HH:mm:ss' },
  { label: '布尔', value: 'boolean', description: '布尔值，true/false' },
  { label: '二进制', value: 'binary', description: '二进制数据' },
  { label: 'JSON', value: 'json', description: 'JSON 数据' },
]; 