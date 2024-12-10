# DB Modeler API 文档

## 概述
本文档提供了 DB Modeler 应用程序所有后端 API 的详细说明。

## API 状态说明
- ✅ 已完成实现和测试
- 🟡 已实现但需要测试
- ❌ 未实现
- 🔄 开发中

## 认证相关接口
### 认证控制器 (`/api/auth`)
| 方法 | 接口路径 | 功能描述 | 状态 | 备注 |
|--------|----------|-------------|---------|-------|
| POST | `/login` | 用户登录 | ✅ | 返回JWT令牌 |
| POST | `/register` | 用户注册 | ✅ | 创建新用户账号 |
| POST | `/refresh` | 刷新令牌 | ✅ | 刷新JWT令牌 |
| POST | `/logout` | 用户登出 | ✅ | 使令牌失效 |

## 用户管理接口
### 用户控制器 (`/api/users`)
| 方法 | 接口路径 | 功能描述 | 状态 | 备注 |
|--------|----------|-------------|---------|-------|
| GET | `/users` | 获取所有用户 | ✅ | 仅管理员可用 |
| GET | `/users/{id}` | 获取指定用户 | ✅ | |
| PUT | `/users/{id}` | 更新用户信息 | ✅ | |
| DELETE | `/users/{id}` | 删除用户 | ✅ | 仅管理员可用 |
| PUT | `/users/{id}/password` | 修改密码 | ✅ | |

## 项目管理接口
### 项目控制器 (`/api/projects`)
| 方法 | 接口路径 | 功能描述 | 状态 | 备注 |
|--------|----------|-------------|---------|-------|
| POST | `/projects` | 创建项目 | ✅ | |
| GET | `/projects` | 获取所有项目 | ✅ | |
| GET | `/projects/{id}` | 获取指定项目 | ✅ | |
| PUT | `/projects/{id}` | 更新项目信息 | ✅ | |
| DELETE | `/projects/{id}` | 删除项目 | ✅ | |
| GET | `/projects/{id}/members` | 获取项目成员 | ✅ | |
| POST | `/projects/{id}/members` | 添加项目成员 | ✅ | |
| DELETE | `/projects/{id}/members/{memberId}` | 删除项目成员 | ✅ | |

## 项目 API

### 创建项目
- **请求方法**: `POST /api/projects`
- **请求体**:
  ```json
  {
      "name": "项目名称",
      "description": "项目描述",
      "tenantId": "租户ID"
  }
  ```
- **响应**:
  ```json
  {
      "code": 0,
      "message": "success",
      "data": {
          "id": "项目ID",
          "name": "项目名称",
          "description": "项目描述"
      }
  }
  ```

### 获取项目
- **请求方法**: `GET /api/projects/{id}`
- **响应**:
  ```json
  {
      "code": 0,
      "message": "success",
      "data": {
          "id": "项目ID",
          "name": "项目名称",
          "description": "项目描述"
      }
  }
  ```

### 获取所有项目
- **请求方法**: `GET /api/projects`
- **请求参数**: `tenantId` (可选)
- **响应**:
  ```json
  {
      "code": 0,
      "message": "success",
      "data": [
          {
              "id": "项目ID",
              "name": "项目名称",
              "description": "项目描述"
          }
      ]
  }
  ```

## 租户 API

### 选择租户
- **请求方法**: `GET /api/tenants`
- **响应**:
  ```json
  {
      "code": 0,
      "message": "success",
      "data": [
          {
              "id": "租户ID",
              "name": "租户名称"
          }
      ]
  }
  ```

### 创建租户
- **请求方法**: `POST /api/tenants`
- **请求体**:
  ```json
  {
      "name": "租户名称",
      "code": "租户代码",
      "description": "描述"
  }
  ```
- **响应**:
  ```json
  {
      "code": 0,
      "message": "success",
      "data": {
          "id": "租户ID",
          "name": "租户名称"
      }
  }
  ```

## 数据库设计接口
### 表设计控制器 (`/api/table-design`)
| 方法 | 接口路径 | 功能描述 | 状态 | 备注 |
|--------|----------|-------------|---------|-------|
| POST | `/table-design` | 创建表设计 | ✅ | |
| GET | `/table-design/{projectId}` | 获取项目下所有表 | ✅ | |
| PUT | `/table-design/{id}` | 更新表设计 | ✅ | |
| DELETE | `/table-design/{id}` | 删除表 | ✅ | |
| POST | `/table-design/batch` | 批量创建表 | ✅ | |

### 表关系控制器 (`/api/table-relations`)
| 方法 | 接口路径 | 功能描述 | 状态 | 备注 |
|--------|----------|-------------|---------|-------|
| POST | `/table-relations` | 创建表关系 | ✅ | |
| GET | `/table-relations/{projectId}` | 获取项目下所有关系 | ✅ | |
| PUT | `/table-relations/{id}` | 更新表关系 | ✅ | |
| DELETE | `/table-relations/{id}` | 删除表关系 | ✅ | |

### 图形布局控制器 (`/api/graph-layouts`)
| 方法 | 接口路径 | 功能描述 | 状态 | 备注 |
|--------|----------|-------------|---------|-------|
| POST | `/graph-layouts` | 保存图形布局 | ✅ | |
| GET | `/graph-layouts/{projectId}` | 获取项目布局 | ✅ | |
| PUT | `/graph-layouts/{id}` | 更新布局 | ✅ | |
| DELETE | `/graph-layouts/{id}` | 删除布局 | ✅ | |

## 数据库管理接口
### 数据库控制器 (`/api/database`)
| 方法 | 接口路径 | 功能描述 | 状态 | 备注 |
|--------|----------|-------------|---------|-------|
| POST | `/database/connect` | 测试连接 | ✅ | |
| POST | `/database/execute` | 执行SQL | ✅ | |
| GET | `/database/metadata` | 获取数据库元数据 | ✅ | |

### 数据库配置控制器 (`/api/database-config`)
| 方法 | 接口路径 | 功能描述 | 状态 | 备注 |
|--------|----------|-------------|---------|-------|
| POST | `/database-config` | 保存配置 | ✅ | |
| GET | `/database-config/{projectId}` | 获取项目配置 | ✅ | |
| PUT | `/database-config/{id}` | 更新配置 | ✅ | |
| DELETE | `/database-config/{id}` | 删除配置 | ✅ | |

## 数据库配置 API

### 获取项目的所有数据库配置

```http
GET /api/projects/{projectId}/database-configs
```

**路径参数：**
- `projectId` - 项目ID

**响应：**
```json
[
  {
    "id": "string",
    "projectId": "string",
    "name": "string",
    "description": "string",
    "type": "MYSQL",
    "host": "string",
    "port": 3306,
    "databaseName": "string",
    "username": "string",
    "status": "ACTIVE",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

### 获取单个数据库配置

```http
GET /api/projects/{projectId}/database-configs/{id}
```

**路径参数：**
- `projectId` - 项目ID
- `id` - 配置ID

**响应：**
```json
{
  "id": "string",
  "projectId": "string",
  "name": "string",
  "description": "string",
  "type": "MYSQL",
  "host": "string",
  "port": 3306,
  "databaseName": "string",
  "username": "string",
  "status": "ACTIVE",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### 创建数据库配置

```http
POST /api/projects/{projectId}/database-configs
```

**路径参数：**
- `projectId` - 项目ID

**请求体：**
```json
{
  "name": "string",
  "description": "string",
  "type": "MYSQL",
  "host": "string",
  "port": 3306,
  "databaseName": "string",
  "username": "string",
  "password": "string"
}
```

### 更新数据库配置

```http
PUT /api/projects/{projectId}/database-configs/{id}
```

**路径参数：**
- `projectId` - 项目ID
- `id` - 配置ID

**请求体：**
```json
{
  "name": "string",
  "description": "string",
  "type": "MYSQL",
  "host": "string",
  "port": 3306,
  "databaseName": "string",
  "username": "string",
  "password": "string"
}
```

### 删除数据库配置

```http
DELETE /api/projects/{projectId}/database-configs/{id}
```

**路径参数：**
- `projectId` - 项目ID
- `id` - 配置ID

### 测试数据库连接

```http
POST /api/projects/{projectId}/database-configs/test-connection
```

**路径参数：**
- `projectId` - 项目ID

**请求体：**
```json
{
  "type": "MYSQL",
  "host": "string",
  "port": 3306,
  "databaseName": "string",
  "username": "string",
  "password": "string"
}
```

**响应：**
```json
{
  "success": true
}
```

## 数据迁移接口
### 数据映射控制器 (`/api/data-mapping`)
| 方法 | 接口路径 | 功能描述 | 状态 | 备注 |
|--------|----------|-------------|---------|-------|
| POST | `/data-mapping` | 创建映射 | ✅ | |
| GET | `/data-mapping/{projectId}` | 获取项目映射 | ✅ | |
| PUT | `/data-mapping/{id}` | 更新映射 | ✅ | |
| DELETE | `/data-mapping/{id}` | 删除映射 | ✅ | |

### 反向工程控制器 (`/api/reverse-engineering`)
| 方法 | 接口路径 | 功能描述 | 状态 | 备注 |
|--------|----------|-------------|---------|-------|
| POST | `/reverse-engineering/import` | 导入数据库架构 | ✅ | |
| POST | `/reverse-engineering/analyze` | 分析数据库 | ✅ | |

### 表比较控制器 (`/api/table-compare`)
| 方法 | 接口路径 | 功能描述 | 状态 | 备注 |
|--------|----------|-------------|---------|-------|
| POST | `/table-compare/diff` | 比较表差异 | ✅ | |
| GET | `/table-compare/history` | 获取比较历史 | ✅ | |

## 多租户接口
### 租户控制器 (`/api/tenants`)
| 方法 | 接口路径 | 功能描述 | 状态 | 备注 |
|--------|----------|-------------|---------|-------|
| POST | `/tenants` | 创建租户 | ✅ | 仅管理员可用 |
| GET | `/tenants` | 获取所有租户 | ✅ | 仅管理员可用 |
| GET | `/tenants/{id}` | 获取指定租户 | ✅ | |
| PUT | `/tenants/{id}` | 更新租户 | ✅ | 仅管理员可用 |
| DELETE | `/tenants/{id}` | 删除租户 | ✅ | 仅管理员可用 |

## 访问限制
所有API都受到访问频率限制：
- 已认证用户：每分钟100次请求
- 未认证用户：每分钟20次请求

## 认证说明
- 除了 `/api/auth/login` 和 `/api/auth/register` 外，所有接口都需要JWT认证
- JWT令牌需要在请求头的Authorization字段中以Bearer方式提供

## 错误处理
所有API遵循统一的错误响应格式：
```json
{
    "timestamp": "2024-12-07T14:15:49.123Z",
    "status": 400,
    "error": "请求错误",
    "message": "详细错误信息",
    "path": "/api/endpoint"
}
```

## 测试状态
- 单元测试：✅ 95% 覆盖率
- 集成测试：✅ 90% 覆盖率
- 端到端测试：🟡 75% 覆盖率

## 注意事项
- 所有接口均返回JSON格式响应
- 所有时间戳使用ISO 8601格式
- 所有ID使用UUID格式
- 列表接口支持使用 `page` 和 `size` 参数进行分页
