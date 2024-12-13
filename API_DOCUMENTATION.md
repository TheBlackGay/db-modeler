# DB Modeler API 接口文档

## 最新更新
- 添加了 JSON 类型处理支持
- 优化了存储引擎验证逻辑
- 完善了错误处理机制

## 数据类型处理
### JSON 类型
在数据库设计中，支持 JSON 类型的字段处理。系统会自动处理 JSON 数据的序列化和反序列化。

#### 示例
```json
{
  "columns": {
    "fields": [
      {
        "name": "id",
        "type": "INT",
        "primaryKey": true
      }
    ],
    "indexes": [
      {
        "name": "idx_name",
        "columns": ["name"]
      }
    ]
  }
}
```

### 存储引擎
支持以下存储引擎（大小写不敏感）：
- InnoDB
- MyISAM
- Memory
- CSV
- Archive

## 目录
1. [认证管理](#认证管理)
   - [用户注册](#post-apiauthregister-用户注册)
   - [用户登录](#post-apiauthlogin-用户登录)
   - [获取用户信息](#get-apiauthprofileid-获取用户信息)
   - [发送重置密码验证码](#post-apiauthsend-reset-code-发送重置密码验证码)
   - [重置密码](#post-apiauthresetpassword-重置密码)

2. [用户管理](#用户管理)
   - [获取用户列表](#get-apiusers-获取用户列表)
   - [更新用户信息](#put-apiusers-更新用户信息)
   - [删除用户](#delete-apiusersid-删除用户)
   - [搜索用户](#get-apiuserssearch-搜索用户)

3. [租户管理](#租户管理)
   - [创建租户](#post-apitenants-创建租户)
   - [获取租户列表](#get-apitenants-获取租户列表)
   - [获取租户详情](#get-apitenantsid-获取租户详情)
   - [更新租户](#put-apitenantsid-更新租户)
   - [删除租户](#delete-apitenantsid-删除租户)

4. [项目管理](#项目管理)
   - [创建项目](#post-apiprojects-创建项目)
   - [获取项目列表](#get-apiprojects-获取项目列表)
   - [获取项目详情](#get-apiprojectsid-获取项目详情)
   - [更新项目](#put-apiprojectsid-更新项目)
   - [删除项目](#delete-apiprojectsid-删除项目)
   - [获取项目成员](#get-apiprojectsidmembers-获取项目成员)
   - [添加项目成员](#post-apiprojectsidmembers-添加项目成员)
   - [删除项目成员](#delete-apiprojectsidmembersmemberid-删除项目成员)

5. [数据库配置管理](#数据库配置管理)
   - [获取数据库配置列表](#get-apiprojectsprojectiddatabase-configs-获取数据库配置列表)
   - [获取数据库配置详情](#get-apiprojectsprojectiddatabase-configsid-获取数据库配置详情)
   - [创建数据库配置](#post-apiprojectsprojectiddatabase-configs-创建数据库配置)
   - [更新数据库配置](#put-apiprojectsprojectiddatabase-configsid-更新数据库配置)
   - [删除数据库配置](#delete-apiprojectsprojectiddatabase-configsid-删除数据库配置)
   - [测试数据库连接](#post-apiprojectsprojectiddatabase-configstest-connection-测试数据库连接)

6. [反向工程管理](#反向工程管理)
   - [提取数据库架构](#get-apireverse-engineeringextract-schemaconnectionid-提取数据库架构)

7. [图形布局管理](#图形布局管理)
   - [获取项目布局](#get-apigraph-layoutsprojectsprojectid-获取项目布局)
   - [保存项目布局](#post-apigraph-layoutsprojectsprojectid-保存项目布局)

8. [字段模板管理](#字段模板管理)
   - [获取字段模板列表](#get-apifield-templates-获取字段模板列表)
   - [获取字段模板详情](#get-apifield-templatesid-获取字段模板详情)
   - [创建字段模板](#post-apifield-templates-创建字段模板)
   - [更新字段模板](#put-apifield-templatesid-更新字段模板)
   - [删除字段模板](#delete-apifield-templatesid-删除字段模板)
   - [添加标签](#post-apifield-templatestemplateidtagstagid-添加标签)

## 认证管理

### POST /api/auth/register 用户注册
#### 请求参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| username | string | singular | 是 | 用户名 | john_doe |
| email | string | singular | 是 | 邮箱 | john@example.com |
| password | string | singular | 是 | 密码 | password123 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | object | 是 | 返回结果 | |
| ├─ id | string | 是 | 用户ID | test_123456 |
| ├─ username | string | 是 | 用户名 | john_doe |
| ├─ email | string | 是 | 邮箱 | john@example.com |
| ├─ status | string | 是 | 状态 | ACTIVE |
| ├─ createdAt | string | 是 | 创建时间 | 2024-03-15T10:00:00Z |
| └─ updatedAt | string | 是 | 更新时间 | 2024-03-15T10:00:00Z |

### POST /api/auth/login 用户登录
#### 请求参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| email | string | singular | 是 | 邮箱 | john@example.com |
| password | string | singular | 是 | 密码 | password123 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | object | 是 | 返回结果 | |
| ├─ token | string | 是 | JWT令牌 | eyJhbGciOiJ... |
| ├─ id | string | 是 | 用户ID | test_123456 |
| ├─ username | string | 是 | 用户名 | john_doe |
| ├─ email | string | 是 | 邮箱 | john@example.com |
| └─ status | string | 是 | 状态 | ACTIVE |

### GET /api/auth/profile/{id} 获取用户信息
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| id | string | singular | 是 | 用户ID | test_123456 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | object | 是 | 返回结果 | |
| ├─ id | string | 是 | 用户ID | test_123456 |
| ├─ username | string | 是 | 用户名 | john_doe |
| ├─ email | string | 是 | 邮箱 | john@example.com |
| ├─ status | string | 是 | 状态 | ACTIVE |
| ├─ createdAt | string | 是 | 创建时间 | 2024-03-15T10:00:00Z |
| └─ updatedAt | string | 是 | 更新时间 | 2024-03-15T10:00:00Z |

### POST /api/auth/send-reset-code 发送重置密码验证码
#### 请求参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| email | string | singular | 是 | 邮箱 | john@example.com |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |

### POST /api/auth/reset-password 重置密码
#### 请求参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| email | string | singular | 是 | 邮箱 | john@example.com |
| resetCode | string | singular | 是 | 验证码 | 123456 |
| newPassword | string | singular | 是 | 新密码 | newpassword123 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |

## 用户管理

### GET /api/users 获取用户列表
#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | array | 是 | 返回结果 | |
| ├─ id | string | 是 | 用户ID | test_123456 |
| ├─ username | string | 是 | 用户名 | john_doe |
| ├─ email | string | 是 | 邮箱 | john@example.com |
| ├─ status | string | 是 | 状态 | ACTIVE |
| ├─ createdAt | string | 是 | 创建时间 | 2024-03-15T10:00:00Z |
| └─ updatedAt | string | 是 | 更新时间 | 2024-03-15T10:00:00Z |

### PUT /api/users 更新用户信息
#### 请求参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| id | string | singular | 是 | 用户ID | test_123456 |
| username | string | singular | 否 | 用户名 | john_doe |
| email | string | singular | 否 | 邮箱 | john@example.com |
| status | string | singular | 否 | 状态 | ACTIVE |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | object | 是 | 返回结果 | |
| ├─ id | string | 是 | 用户ID | test_123456 |
| ├─ username | string | 是 | 用户名 | john_doe |
| ├─ email | string | 是 | 邮箱 | john@example.com |
| ├─ status | string | 是 | 状态 | ACTIVE |
| ├─ createdAt | string | 是 | 创建时间 | 2024-03-15T10:00:00Z |
| └─ updatedAt | string | 是 | 更新时间 | 2024-03-15T10:00:00Z |

### DELETE /api/users/{id} 删除用户
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| id | string | singular | 是 | 用户ID | test_123456 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |

### GET /api/users/search 搜索用户
#### 请求参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| query | string | singular | 是 | 搜索关键词 | john |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | array | 是 | 返回结果 | |
| ├─ id | string | 是 | 用户ID | test_123456 |
| ├─ username | string | 是 | 用户名 | john_doe |
| ├─ email | string | 是 | 邮箱 | john@example.com |
| ├─ status | string | 是 | 状态 | ACTIVE |
| ├─ createdAt | string | 是 | 创建时间 | 2024-03-15T10:00:00Z |
| └─ updatedAt | string | 是 | 更新时间 | 2024-03-15T10:00:00Z |

## 租户管理

### POST /api/tenants 创建租户
#### 请求参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| name | string | singular | 是 | 租户名称 | 测试租户 |
| code | string | singular | 是 | 租户代码 | test_tenant |
| description | string | singular | 否 | 租户描述 | 这是一个测试租户 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | object | 是 | 返回结果 | |
| ├─ id | string | 是 | 租户ID | test_123456 |
| ├─ name | string | 是 | 租户名称 | 测试租户 |
| ├─ code | string | 是 | 租户代码 | test_tenant |
| ├─ description | string | 否 | 租户描述 | 这是一个测试租户 |
| ├─ status | string | 是 | 状态 | ACTIVE |
| ├─ createdAt | string | 是 | 创建时间 | 2024-03-15T10:00:00Z |
| └─ updatedAt | string | 是 | 更新时间 | 2024-03-15T10:00:00Z |

### GET /api/tenants 获取租户列表
#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | array | 是 | 返回结果 | |
| ├─ id | string | 是 | 租户ID | test_123456 |
| ├─ name | string | 是 | 租户名称 | 测试租户 |
| ├─ code | string | 是 | 租户代码 | test_tenant |
| ├─ description | string | 否 | 租户描述 | 这是一个测试租户 |
| ├─ status | string | 是 | 状态 | ACTIVE |
| ├─ createdAt | string | 是 | 创建时间 | 2024-03-15T10:00:00Z |
| └─ updatedAt | string | 是 | 更新时间 | 2024-03-15T10:00:00Z |

### GET /api/tenants/{id} 获取租户详情
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| id | string | singular | 是 | 租户ID | test_123456 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | object | 是 | 返回结果 | |
| ├─ id | string | 是 | 租户ID | test_123456 |
| ├─ name | string | 是 | 租户名称 | 测试租户 |
| ├─ code | string | 是 | 租户代码 | test_tenant |
| ├─ description | string | 否 | 租户描述 | 这是一个测试租户 |
| ├─ status | string | 是 | 状态 | ACTIVE |
| ├─ createdAt | string | 是 | 创建时间 | 2024-03-15T10:00:00Z |
| └─ updatedAt | string | 是 | 更新时间 | 2024-03-15T10:00:00Z |

### PUT /api/tenants/{id} 更新租户
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| id | string | singular | 是 | 租户ID | test_123456 |

#### 请求参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| name | string | singular | 否 | 租户名称 | 测试租户 |
| code | string | singular | 否 | 租户代码 | test_tenant |
| description | string | singular | 否 | 租户描述 | 这是一个测试租户 |
| status | string | singular | 否 | 状态 | ACTIVE |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | object | 是 | 返回结果 | |
| └─ ... | | | (字段同获取租户详情) | |

### DELETE /api/tenants/{id} 删除租户
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| id | string | singular | 是 | 租户ID | test_123456 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |

## 项目管理

### POST /api/projects 创建项目
#### 请求参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| name | string | singular | 是 | 项目名称 | 测试项目 |
| code | string | singular | 是 | 项目代码 | test_project |
| description | string | singular | 否 | 项目描述 | 这是一个测试项目 |
| tenantId | string | singular | 是 | 租户ID | test_123456 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | object | 是 | 返回结果 | |
| ├─ id | string | 是 | 项目ID | test_123456 |
| ├─ name | string | 是 | 项目名称 | 测试项目 |
| ├─ code | string | 是 | 项目代码 | test_project |
| ├─ description | string | 否 | 项目描述 | 这是一个测试项目 |
| ├─ tenantId | string | 是 | 租户ID | test_123456 |
| ├─ status | string | 是 | 状态 | ACTIVE |
| ├─ createdAt | string | 是 | 创建时间 | 2024-03-15T10:00:00Z |
| └─ updatedAt | string | 是 | 更新时间 | 2024-03-15T10:00:00Z |

### GET /api/projects 获取项目列表
#### 请求参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| tenantId | string | singular | 是 | 租户ID | test_123456 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | array | 是 | 返回结果 | |
| ├─ id | string | 是 | 项目ID | test_123456 |
| ├─ name | string | 是 | 项目名称 | 测试项目 |
| ├─ code | string | 是 | 项目代码 | test_project |
| ├─ description | string | 否 | 项目描述 | 这是一个测试项目 |
| ├─ tenantId | string | 是 | 租户ID | test_123456 |
| ├─ status | string | 是 | 状态 | ACTIVE |
| ├─ createdAt | string | 是 | 创建时间 | 2024-03-15T10:00:00Z |
| └─ updatedAt | string | 是 | 更新时间 | 2024-03-15T10:00:00Z |

### GET /api/projects/{id} 获取项目详情
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| id | string | singular | 是 | 项目ID | test_123456 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | object | 是 | 返回结果 | |
| ├─ id | string | 是 | 项目ID | test_123456 |
| ├─ name | string | 是 | 项目名称 | 测试项目 |
| ├─ code | string | 是 | 项目代码 | test_project |
| ├─ description | string | 否 | 项目描述 | 这是一个测试项目 |
| ├─ tenantId | string | 是 | 租户ID | test_123456 |
| ├─ status | string | 是 | 状态 | ACTIVE |
| ├─ createdAt | string | 是 | 创建时间 | 2024-03-15T10:00:00Z |
| └─ updatedAt | string | 是 | 更新时间 | 2024-03-15T10:00:00Z |

### PUT /api/projects/{id} 更新项目
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| id | string | singular | 是 | 项目ID | test_123456 |

#### 请求参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| name | string | singular | 否 | 项目名称 | 测试项目 |
| code | string | singular | 否 | 项目代码 | test_project |
| description | string | singular | 否 | 项目描述 | 这是一个测试项目 |
| status | string | singular | 否 | 状态 | ACTIVE |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | object | 是 | 返回结果 | |
| └─ ... | | | (字段同获取项目详情) | |

### DELETE /api/projects/{id} 删除项目
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| id | string | singular | 是 | 项目ID | test_123456 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |

### GET /api/projects/{id}/members 获取项目成员
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| id | string | singular | 是 | 项目ID | test_123456 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | array | 是 | 返回结果 | |
| ├─ id | string | 是 | 成员ID | test_123456 |
| ├─ userId | string | 是 | 用户ID | test_123456 |
| ├─ projectId | string | 是 | 项目ID | test_123456 |
| ├─ role | string | 是 | 角色 | ADMIN |
| ├─ createdAt | string | 是 | 创建时间 | 2024-03-15T10:00:00Z |
| └─ updatedAt | string | 是 | 更新时间 | 2024-03-15T10:00:00Z |

### POST /api/projects/{id}/members 添加项目成员
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| id | string | singular | 是 | 项目ID | test_123456 |

#### 请求参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| userId | string | singular | 是 | 用户ID | test_123456 |
| role | string | singular | 是 | 角色 | ADMIN |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | object | 是 | 返回结果 | |
| ├─ id | string | 是 | 成员ID | test_123456 |
| ├─ userId | string | 是 | 用户ID | test_123456 |
| ├─ projectId | string | 是 | 项目ID | test_123456 |
| ├─ role | string | 是 | 角色 | ADMIN |
| ├─ createdAt | string | 是 | 创建时间 | 2024-03-15T10:00:00Z |
| └─ updatedAt | string | 是 | 更新时间 | 2024-03-15T10:00:00Z |

### DELETE /api/projects/{id}/members/{memberId} 删除项目成员
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| id | string | singular | 是 | 项目ID | test_123456 |
| memberId | string | singular | 是 | 成员ID | test_123456 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |

## 数据库配置管理

### GET /api/projects/{projectId}/database-configs 获取数据库配置列表
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| projectId | string | singular | 是 | 项目ID | test_123456 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | array | 是 | 返回结果 | |
| ├─ id | string | 是 | 配置ID | test_123456 |
| ├─ projectId | string | 是 | 项目ID | test_123456 |
| ├─ name | string | 是 | 配置名称 | 测试数据库 |
| ├─ description | string | 否 | 配置描述 | 这是一个测试数据库 |
| ├─ type | string | 是 | 数据库类型 | MYSQL |
| ├─ host | string | 是 | 主机地址 | localhost |
| ├─ port | number | 是 | 端口号 | 3306 |
| ├─ databaseName | string | 是 | 数据库名 | test_db |
| ├─ username | string | 是 | 用户名 | root |
| ├─ status | string | 是 | 状态 | ACTIVE |
| ├─ createdAt | string | 是 | 创建时间 | 2024-03-15T10:00:00Z |
| └─ updatedAt | string | 是 | 更新时间 | 2024-03-15T10:00:00Z |

### GET /api/projects/{projectId}/database-configs/{id} 获取数据库配置详情
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| projectId | string | singular | 是 | 项目ID | test_123456 |
| id | string | singular | 是 | 配置ID | test_123456 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | object | 是 | 返回结果 | |
| ├─ id | string | 是 | 配置ID | test_123456 |
| ├─ projectId | string | 是 | 项目ID | test_123456 |
| ├─ name | string | 是 | 配置名称 | 测试数据库 |
| ├─ description | string | 否 | 配置描述 | 这是一个测试数据库 |
| ├─ type | string | 是 | 数据库类型 | MYSQL |
| ├─ host | string | 是 | 主机地址 | localhost |
| ├─ port | number | 是 | 端口号 | 3306 |
| ├─ databaseName | string | 是 | 数据库名 | test_db |
| ├─ username | string | 是 | 用户名 | root |
| ├─ status | string | 是 | 状态 | ACTIVE |
| ├─ createdAt | string | 是 | 创建时间 | 2024-03-15T10:00:00Z |
| └─ updatedAt | string | 是 | 更新时间 | 2024-03-15T10:00:00Z |

### POST /api/projects/{projectId}/database-configs 创建数据库配置
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| projectId | string | singular | 是 | 项目ID | test_123456 |

#### 请求参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| name | string | singular | 是 | 配置名称 | 测试数据库 |
| description | string | singular | 否 | 配置描述 | 这是一个测试数据库 |
| type | string | singular | 是 | 数据库类型 | MYSQL |
| host | string | singular | 是 | 主机地址 | localhost |
| port | number | singular | 是 | 端口号 | 3306 |
| databaseName | string | singular | 是 | 数据库名 | test_db |
| username | string | singular | 是 | 用户名 | root |
| password | string | singular | 是 | 密码 | password123 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | object | 是 | 返回结果 | |
| └─ ... | | | (字段同获取数据库配置详情) | |

### PUT /api/projects/{projectId}/database-configs/{id} 更新数据库配置
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| projectId | string | singular | 是 | 项目ID | test_123456 |
| id | string | singular | 是 | 配置ID | test_123456 |

#### 请求参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| name | string | singular | 否 | 配置名称 | 测试数据库 |
| description | string | singular | 否 | 配置描述 | 这是一个测试数据库 |
| type | string | singular | 否 | 数据库类型 | MYSQL |
| host | string | singular | 否 | 主机地址 | localhost |
| port | number | singular | 否 | 端口号 | 3306 |
| databaseName | string | singular | 否 | 数据库名 | test_db |
| username | string | singular | 否 | 用户名 | root |
| password | string | singular | 否 | 密码 | password123 |
| status | string | singular | 否 | 状态 | ACTIVE |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | object | 是 | 返回结果 | |
| └─ ... | | | (字段同获取数据库配置详情) | |

### DELETE /api/projects/{projectId}/database-configs/{id} 删除数据库配置
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| projectId | string | singular | 是 | 项目ID | test_123456 |
| id | string | singular | 是 | 配置ID | test_123456 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |

### POST /api/projects/{projectId}/database-configs/test-connection 测试数据库连接
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| projectId | string | singular | 是 | 项目ID | test_123456 |

#### 请求参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| type | string | singular | 是 | 数据库类型 | MYSQL |
| host | string | singular | 是 | 主机地址 | localhost |
| port | number | singular | 是 | 端口号 | 3306 |
| databaseName | string | singular | 是 | 数据库名 | test_db |
| username | string | singular | 是 | 用户名 | root |
| password | string | singular | 是 | 密码 | password123 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |

## 反向工程管理

### GET /api/reverse-engineering/extract-schema/{connectionId} 提取数据库架构
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| connectionId | string | singular | 是 | 数据库连接ID | test_123456 |

#### 请求参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| projectId | string | singular | 是 | 项目ID | test_123456 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | array | 是 | 返回结果 | |
| ├─ tableName | string | 是 | 表名 | user_info |
| ├─ tableComment | string | 否 | 表注释 | 用户信息表 |
| ├─ columns | array | 是 | 列定义 | |
| │  ├─ name | string | 是 | 列名 | id |
| │  ├─ type | string | 是 | 数据类型 | varchar |
| │  ├─ length | number | 否 | 长度 | 32 |
| │  ├─ precision | number | 否 | 精度 | 2 |
| │  ├─ scale | number | 否 | 小数位数 | 1 |
| │  ├─ nullable | boolean | 是 | 是否可空 | false |
| │  ├─ defaultValue | string | 否 | 默认值 | NULL |
| │  ├─ comment | string | 否 | 列注释 | 主键ID |
| │  ├─ primaryKey | boolean | 是 | 是否主键 | true |
| │  ├─ autoIncrement | boolean | 是 | 是否自增 | false |
| │  └─ unsigned | boolean | 是 | 是否无符号 | false |
| ├─ indexes | array | 是 | 索引定义 | |
| │  ├─ name | string | 是 | 索引名 | idx_name |
| │  ├─ type | string | 是 | 索引类型 | NORMAL |
| │  ├─ columns | array | 是 | 索引列 | |
| │  │  ├─ name | string | 是 | 列名 | name |
| │  │  └─ order | string | 是 | 排序方式 | ASC |
| │  └─ unique | boolean | 是 | 是否唯一 | false |
| └─ foreignKeys | array | 是 | 外键定义 | |
|    ├─ name | string | 是 | 外键名 | fk_user_role |
|    ├─ columns | array | 是 | 外键列 | |
|    │  └─ name | string | 是 | 列名 | role_id |
|    ├─ referenceTable | string | 是 | 引用表 | role |
|    └─ referenceColumns | array | 是 | 引用列 | |
|       └─ name | string | 是 | 列名 | id |

## 图形布局管理

### GET /api/graph-layouts/projects/{projectId} 获取项目布局
#### 路径参数
| 参数�� | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| projectId | string | singular | 是 | 项目ID | test_123456 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | array | 是 | 返回结果 | |
| ├─ id | string | 是 | 布局ID | test_123456 |
| ├─ projectId | string | 是 | 项目ID | test_123456 |
| ├─ layoutData | object | 是 | 布局数据 | |
| │  ├─ nodes | array | 是 | 节点列表 | |
| │  │  ├─ id | string | 是 | 节点ID | test_123456 |
| │  │  ├─ position | object | 是 | 位置信息 | |
| │  │  │  ├─ x | number | 是 | X坐标 | 100 |
| │  │  │  └─ y | number | 是 | Y坐标 | 200 |
| │  │  └─ size | object | 是 | 大小信息 | |
| │  │     ├─ width | number | 是 | 宽度 | 150 |
| │  │     └─ height | number | 是 | 高度 | 100 |
| │  └─ edges | array | 是 | 边列表 | |
| │     ├─ id | string | 是 | 边ID | test_123456 |
| │     ├─ sourceNodeId | string | 是 | 源节点ID | test_123456 |
| │     ├─ targetNodeId | string | 是 | 目标节点ID | test_123456 |
| │     └─ points | array | 是 | 路径点列表 | |
| │        ├─ x | number | 是 | X坐标 | 120 |
| │        └─ y | number | 是 | Y坐标 | 220 |
| ├─ createdAt | string | 是 | 创建时间 | 2024-03-15T10:00:00Z |
| └─ updatedAt | string | 是 | 更新时间 | 2024-03-15T10:00:00Z |

### POST /api/graph-layouts/projects/{projectId} 保存项目布局
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| projectId | string | singular | 是 | 项目ID | test_123456 |

#### 请求参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| layoutData | object | singular | 是 | 布局数据 | |
| ├─ nodes | array | singular | 是 | 节点列表 | |
| │  ├─ id | string | singular | 是 | 节点ID | test_123456 |
| │  ├─ position | object | singular | 是 | 位置信息 | |
| │  │  ├─ x | number | singular | 是 | X坐标 | 100 |
| │  │  └─ y | number | singular | 是 | Y坐标 | 200 |
| │  └─ size | object | singular | 是 | 大小信息 | |
| │     ├─ width | number | singular | 是 | 宽度 | 150 |
| │     └─ height | number | singular | 是 | 高度 | 100 |
| └─ edges | array | singular | 是 | 边列表 | |
|    ├─ id | string | singular | 是 | 边ID | test_123456 |
|    ├─ sourceNodeId | string | singular | 是 | 源节点ID | test_123456 |
|    ├─ targetNodeId | string | singular | 是 | 目标节点ID | test_123456 |
|    └─ points | array | singular | 是 | 路径点列表 | |
|       ├─ x | number | singular | 是 | X坐标 | 120 |
|       └─ y | number | singular | 是 | Y坐标 | 220 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | object | 是 | 返回结果 | |
| └─ ... | | | (字段同获取项目布局) | |

## 字段模板管理

### GET /api/field-templates 获取字段模板列表
#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | array | 是 | 返回结果 | |
| ├─ id | string | 是 | 模板ID | test_123456 |
| ├─ name | string | 是 | 模板名称 | 主键ID |
| ├─ code | string | 是 | 模板代码 | id |
| ├─ description | string | 否 | 模板描述 | 主键字段模板 |
| ├─ type | string | 是 | 数据类型 | varchar |
| ├─ length | number | 否 | 长度 | 32 |
| ├─ precision | number | 否 | 精度 | 2 |
| ├─ scale | number | 否 | 小数位数 | 1 |
| ├─ nullable | boolean | 是 | 是否可空 | false |
| ├─ defaultValue | string | 否 | 默认值 | NULL |
| ├─ comment | string | 否 | 字段注释 | 主键ID |
| ├─ primaryKey | boolean | 是 | 是否主键 | true |
| ├─ autoIncrement | boolean | 是 | 是否自增 | false |
| ├─ unsigned | boolean | 是 | 是否无符号 | false |
| ├─ createdAt | string | 是 | 创建时间 | 2024-03-15T10:00:00Z |
| └─ updatedAt | string | 是 | 更新时间 | 2024-03-15T10:00:00Z |

### GET /api/field-templates/{id} 获取字段模板详情
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| id | string | singular | 是 | 模板ID | test_123456 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | object | 是 | 返回结果 | |
| └─ ... | | | (字段同获取字段模板列表) | |

### POST /api/field-templates 创建字段模板
#### 请求参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| name | string | singular | 是 | 模板名称 | 主键ID |
| code | string | singular | 是 | 模板代码 | id |
| description | string | singular | 否 | 模板描述 | 主键字段模板 |
| type | string | singular | 是 | 数据类型 | varchar |
| length | number | singular | 否 | 长度 | 32 |
| precision | number | singular | 否 | 精度 | 2 |
| scale | number | singular | 否 | 小数位数 | 1 |
| nullable | boolean | singular | 是 | 是否可空 | false |
| defaultValue | string | singular | 否 | 默认值 | NULL |
| comment | string | singular | 否 | 字段注释 | 主键ID |
| primaryKey | boolean | singular | 是 | 是否主键 | true |
| autoIncrement | boolean | singular | 是 | 是否自增 | false |
| unsigned | boolean | singular | 是 | 是否无符号 | false |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | object | 是 | 返回结果 | |
| └─ ... | | | (字段同获取字段模板列表) | |

### PUT /api/field-templates/{id} 更新字段模板
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| id | string | singular | 是 | 模板ID | test_123456 |

#### 请求参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| name | string | singular | 否 | 模板名称 | 主键ID |
| code | string | singular | 否 | 模板代码 | id |
| description | string | singular | 否 | 模板描述 | 主键字段模板 |
| type | string | singular | 否 | 数据类型 | varchar |
| length | number | singular | 否 | 长度 | 32 |
| precision | number | singular | 否 | 精度 | 2 |
| scale | number | singular | 否 | 小数位数 | 1 |
| nullable | boolean | singular | 否 | 是否可空 | false |
| defaultValue | string | singular | 否 | 默认值 | NULL |
| comment | string | singular | 否 | 字段注释 | 主键ID |
| primaryKey | boolean | singular | 否 | 是否主键 | true |
| autoIncrement | boolean | singular | 否 | 是否自增 | false |
| unsigned | boolean | singular | 否 | 是否无符号 | false |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |
| result | object | 是 | 返回结果 | |
| └─ ... | | | (字段同获取字段模板列表) | |

### DELETE /api/field-templates/{id} 删除字段模板
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| id | string | singular | 是 | 模板ID | test_123456 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |

### POST /api/field-templates/{templateId}/tags/{tagId} 添加标签
#### 路径参数
| 参数名 | 类型 | 必填类型 | 必填 | 说明 | 示例 |
|--------|------|----------|------|------|------|
| templateId | string | singular | 是 | 模板ID | test_123456 |
| tagId | string | singular | 是 | 标签ID | test_123456 |

#### 返回参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| success | boolean | 是 | 成功标识 | true |
| errcode | string | 是 | 错误码 | 0 |
| errmsg | string | 是 | 错误信息 | |

## 表设计管理

### 获取表设计详情

```http
GET /api/table-designs/{id}/detail
```

**请求参数：**
- `id`: 表设计ID (UUID)

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "uuid",
    "code": "table_name",
    "displayName": "表名",
    "comment": "表注释",
    "type": "TABLE",
    "domain": "BUSINESS",
    "columns": "{\"fields\":[...],\"indexes\":[...]}",
    "metadata": "{\"dbType\":\"MYSQL\",\"engine\":\"InnoDB\",\"charset\":\"utf8mb4\",\"collation\":\"utf8mb4_general_ci\"}",
    "status": "DRAFT",
    "synced": false
  }
}
```

### 保存表设计

```http
PUT /api/table-designs/{id}
```

**请求参数：**
```json
{
  "id": "uuid",
  "code": "table_name",
  "displayName": "表名",
  "comment": "表注释",
  "type": "TABLE",
  "domain": "BUSINESS",
  "columns": "{\"fields\":[...],\"indexes\":[...]}",
  "metadata": "{\"dbType\":\"MYSQL\",\"engine\":\"InnoDB\",\"charset\":\"utf8mb4\",\"collation\":\"utf8mb4_general_ci\"}",
  "status": "DRAFT"
}
```

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    // 同上
  }
}
```

### 同步表到数据库

```http
POST /api/table-designs/{id}/sync
```

**请求参数：**
- `id`: 表设计ID (UUID)

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    // 同上，synced 字段会更新为 true
  }
}
```

### 预览表 DDL

```http
GET /api/table-designs/{id}/preview-ddl
```

**请求参数：**
- `id`: 表设计ID (UUID)

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "ddl": "CREATE TABLE ...",
    "type": "CREATE",
    "tableName": "table_name",
    "status": "success"
  }
}
```

### 导入表设计

```http
POST /api/table-designs/import
Content-Type: multipart/form-data
```

**请求参数：**
- `file`: 表设计文件 (JSON格式)
- `projectId`: 项目ID (UUID)

**文件格式：**
```json
{
  "code": "table_name",
  "displayName": "表名",
  "comment": "表注释",
  "type": "TABLE",
  "domain": "BUSINESS",
  "columns": {
    "fields": [...],
    "indexes": [...]
  },
  "metadata": {
    "dbType": "MYSQL",
    "engine": "InnoDB",
    "charset": "utf8mb4",
    "collation": "utf8mb4_general_ci"
  }
}
```

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    // 导入后的表设计数据
  }
}
```

### 批量导出表 DDL

```http
POST /api/table-designs/export
```

**请求参数：**
```json
{
  "tableIds": ["uuid1", "uuid2", ...]
}
```

**响应数据：**
- Content-Type: application/octet-stream
- Content-Disposition: attachment; filename=table_ddl_yyyyMMddHHmmss.sql
- 响应体为 SQL 文件内容

### 验证表名

```http
POST /api/table-designs/validate
```

**请求参数：**
```json
{
  "projectId": "uuid",
  "name": "table_name"
}
```

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "valid": true,
    "message": "表名可用"
  }
}
```

### 复制表设计

```http
POST /api/table-designs/{id}/copy
```

**请求参数：**
```json
{
  "newName": "new_table_name"
}
```

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    // 新建的表设计数据
  }
}
```

### 同步所有表到数据库

```http
POST /api/table-designs/sync-all
```

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": [
    // 所有同步后的表设计数据
  ]
}
```

### 预览所有表 DDL

```http
GET /api/table-designs/preview-all-ddl
```

**响应数据：**
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "ddl": "CREATE TABLE ...",
      "type": "CREATE",
      "tableName": "table_name",
      "status": "success"
    },
    // ...
  ]
}
```
