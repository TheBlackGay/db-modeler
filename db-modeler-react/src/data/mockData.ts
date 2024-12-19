import { v4 as uuidv4 } from 'uuid';

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
}

export interface ITable {
  id: string;
  name: string;
  comment?: string;
  fields: IField[];
}

export interface IConnection {
  id: string;
  name: string;
  type: 'mysql' | 'postgresql' | 'sqlserver' | 'oracle';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProjectSettings {
  theme: {
    darkMode: boolean;
    primaryColor: string;
    compactMode: boolean;
  };
  database: {
    connectionTimeout: number;
    maxConnections: number;
    defaultDatabase: 'mysql' | 'postgresql' | 'sqlserver' | 'oracle';
    sslEnabled: boolean;
  };
  export: {
    indentStyle: 'space' | 'tab';
    indentSize: number;
    lineEnding: 'lf' | 'crlf';
    upperCase: boolean;
  };
}

export interface IProject {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  tables: ITable[];
  connections: IConnection[];
  settings: IProjectSettings;
}

// 数据库字段类型列表
export const fieldTypes = [
  { label: "整数", value: "int" },
  { label: "长整数", value: "bigint" },
  { label: "小数", value: "decimal" },
  { label: "字符串", value: "varchar" },
  { label: "文本", value: "text" },
  { label: "日期", value: "date" },
  { label: "时间戳", value: "timestamp" },
  { label: "布尔值", value: "boolean" }
];

// 模拟数据
export const mockProjects: IProject[] = [
  {
    id: uuidv4(),
    name: "电商系统",
    description: "包含用户、商品、订单等核心表",
    createdAt: "2023-12-15",
    updatedAt: "2023-12-16",
    tables: [
      {
        id: uuidv4(),
        name: "users",
        comment: "用户表",
        fields: [
          {
            id: uuidv4(),
            name: "id",
            type: "bigint",
            isPrimaryKey: true,
            isAutoIncrement: true,
            isNullable: false,
            comment: "用户ID"
          },
          {
            id: uuidv4(),
            name: "username",
            type: "varchar",
            length: 50,
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            comment: "用户名"
          },
          {
            id: uuidv4(),
            name: "email",
            type: "varchar",
            length: 100,
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            comment: "邮箱"
          },
          {
            id: uuidv4(),
            name: "password",
            type: "varchar",
            length: 100,
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            comment: "密码"
          },
          {
            id: uuidv4(),
            name: "status",
            type: "int",
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            defaultValue: "1",
            comment: "状态：1-正常，0-禁用"
          },
          {
            id: uuidv4(),
            name: "created_at",
            type: "timestamp",
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            defaultValue: "CURRENT_TIMESTAMP",
            comment: "创建时间"
          }
        ]
      },
      {
        id: uuidv4(),
        name: "products",
        comment: "商品表",
        fields: [
          {
            id: uuidv4(),
            name: "id",
            type: "bigint",
            isPrimaryKey: true,
            isAutoIncrement: true,
            isNullable: false,
            comment: "商品ID"
          },
          {
            id: uuidv4(),
            name: "name",
            type: "varchar",
            length: 200,
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            comment: "商品名称"
          },
          {
            id: uuidv4(),
            name: "price",
            type: "decimal",
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            comment: "商品价格"
          },
          {
            id: uuidv4(),
            name: "stock",
            type: "int",
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            defaultValue: "0",
            comment: "库存"
          },
          {
            id: uuidv4(),
            name: "category_id",
            type: "bigint",
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            comment: "分类ID"
          }
        ]
      },
      {
        id: uuidv4(),
        name: "orders",
        comment: "订单表",
        fields: [
          {
            id: uuidv4(),
            name: "id",
            type: "bigint",
            isPrimaryKey: true,
            isAutoIncrement: true,
            isNullable: false,
            comment: "订单ID"
          },
          {
            id: uuidv4(),
            name: "order_no",
            type: "varchar",
            length: 50,
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            comment: "订单编号"
          },
          {
            id: uuidv4(),
            name: "user_id",
            type: "bigint",
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            comment: "用户ID"
          },
          {
            id: uuidv4(),
            name: "total_amount",
            type: "decimal",
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            comment: "订单总金额"
          },
          {
            id: uuidv4(),
            name: "status",
            type: "int",
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            defaultValue: "0",
            comment: "订单状态：0-待支付，1-已支付，2-已发货，3-已完成，4-已取消"
          },
          {
            id: uuidv4(),
            name: "created_at",
            type: "timestamp",
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            defaultValue: "CURRENT_TIMESTAMP",
            comment: "创建时间"
          }
        ]
      }
    ],
    connections: [
      {
        id: uuidv4(),
        name: "本地开发环境",
        type: "mysql",
        host: "localhost",
        port: 3306,
        database: "ecommerce",
        username: "root",
        password: "123456",
        createdAt: "2023-12-15",
        updatedAt: "2023-12-15"
      }
    ],
    settings: {
      theme: {
        darkMode: false,
        primaryColor: '#1890ff',
        compactMode: false,
      },
      database: {
        connectionTimeout: 30,
        maxConnections: 10,
        defaultDatabase: 'mysql',
        sslEnabled: true,
      },
      export: {
        indentStyle: 'space',
        indentSize: 2,
        lineEnding: 'lf',
        upperCase: false,
      },
    }
  },
  {
    id: uuidv4(),
    name: "博客系统",
    description: "包含文章、评论、标签等表",
    createdAt: "2023-12-14",
    updatedAt: "2023-12-15",
    tables: [
      {
        id: uuidv4(),
        name: "articles",
        comment: "文章表",
        fields: [
          {
            id: uuidv4(),
            name: "id",
            type: "bigint",
            isPrimaryKey: true,
            isAutoIncrement: true,
            isNullable: false,
            comment: "文章ID"
          },
          {
            id: uuidv4(),
            name: "title",
            type: "varchar",
            length: 200,
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            comment: "文章标题"
          },
          {
            id: uuidv4(),
            name: "content",
            type: "text",
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            comment: "文章内容"
          },
          {
            id: uuidv4(),
            name: "author_id",
            type: "bigint",
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            comment: "作者ID"
          },
          {
            id: uuidv4(),
            name: "status",
            type: "int",
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            defaultValue: "1",
            comment: "状态：1-已发布，0-草稿"
          },
          {
            id: uuidv4(),
            name: "created_at",
            type: "timestamp",
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            defaultValue: "CURRENT_TIMESTAMP",
            comment: "创建时间"
          }
        ]
      },
      {
        id: uuidv4(),
        name: "comments",
        comment: "评论表",
        fields: [
          {
            id: uuidv4(),
            name: "id",
            type: "bigint",
            isPrimaryKey: true,
            isAutoIncrement: true,
            isNullable: false,
            comment: "评论ID"
          },
          {
            id: uuidv4(),
            name: "article_id",
            type: "bigint",
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            comment: "文章ID"
          },
          {
            id: uuidv4(),
            name: "user_id",
            type: "bigint",
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            comment: "用户ID"
          },
          {
            id: uuidv4(),
            name: "content",
            type: "text",
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            comment: "评论内容"
          },
          {
            id: uuidv4(),
            name: "created_at",
            type: "timestamp",
            isPrimaryKey: false,
            isAutoIncrement: false,
            isNullable: false,
            defaultValue: "CURRENT_TIMESTAMP",
            comment: "创建时间"
          }
        ]
      }
    ],
    connections: [],
    settings: {
      theme: {
        darkMode: false,
        primaryColor: '#1890ff',
        compactMode: false,
      },
      database: {
        connectionTimeout: 30,
        maxConnections: 10,
        defaultDatabase: 'mysql',
        sslEnabled: true,
      },
      export: {
        indentStyle: 'space',
        indentSize: 2,
        lineEnding: 'lf',
        upperCase: false,
      },
    }
  }
]; 