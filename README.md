# DB-Modeler

DB-Modeler 是一个用于管理和操作数据库的工具，提供了用户管理、数据库管理、表设计、数据映射、表比较和逆向工程等模块。该项目旨在简化数据库管理任务，提高开发效率。

## 项目功能概述

- **用户管理模块**：提供用户的创建、读取、更新和删除（CRUD）功能，以及用户认证和授权。
- **数据库管理模块**：支持多种数据库类型的连接管理和操作。
- **表设计模块**：允许用户设计和管理数据库表结构。
- **数据映射模块**：提供数据映射的创建和管理功能。
- **表比较模块**：支持数据库表结构的比较和差异分析。
- **逆向工程模块**：从现有数据库中提取表结构。

## 当前开发进度

### 1. 用户管理模块
- 用户 CRUD 接口已全面实现并通过测试。
- 认证接口大部分功能已实现，密码重置功能正在完善。

### 2. 数据库管理模块
- 数据库 CRUD 接口和连接测试功能已实现并通过测试。
- 连接池管理功能已实现，支持多种数据库类型。

### 3. 表设计模块
- CRUD 接口尚未测试，需进一步开发和测试。

### 4. 数据映射模块
- CRUD 接口尚未测试，需进一步开发和测试。

### 5. 表比较模块
- 接口尚未测试，需实现表结构差异比较功能。

### 6. 逆向工程模块
- 接口尚未测试，需实现从数据库提取表结构的功能。

## 下一步计划
1. 完善密码重置功能，添加邮件发送和错误处理。
2. 测试和完善表设计和数据映射模块的所有功能。
3. 实现表比较和逆向工程模块的核心功能。

## 迭代计划

### v0.1 (已完成)
- ✅ 后端基础框架搭建
  - Spring Boot 项目初始化
  - 数据库设计和配置
  - 基础 CRUD 功能实现
- ✅ 前端项目初始化
  - Vue 3 + TypeScript 项目搭建
  - Ant Design Vue 组件库集成
  - 项目结构规划

### v0.2 (当前版本)
- ✅ 租户管理功能
  - 租户的创建、查询、更新和删除
  - 租户选择器组件
  - 租户状态管理和持久化
- ✅ 项目管理功能
  - 项目的创建、查询、更新和删除
  - 项目与租户的关联
  - 项目列表展示和管理
- ✅ 前端架构优化
  - Pinia 状态管理集成
  - HTTP 请求统一处理
  - 组件化开发
  - 响应式布局

### v0.3 (计划中)
- 📅 数据库配置管理
  - 数据库连接配置
  - 连接测试功能
  - 数据库类型支持
- 📅 表设计功能
  - 可视化表设计器
  - 字段类型管理
  - 索引设计
  - 约束配置
- 📅 项目协作功能
  - 多用户协作
  - 实时协作编辑
  - 冲突解决
  - 变更通知

## 技术栈

### 前端
- Vue 3
- TypeScript
- Vite
- Ant Design Vue
- Pinia (状态管理)
- Axios (HTTP 客户端)

### 后端
- Spring Boot
- Spring Data JPA
- MySQL 8
- Lombok
- MapStruct

## 开发环境要求

- Node.js >= 16
- Java 1.8
- MySQL >= 8.0
- pnpm >= 8

## 本地开发

1. 克隆项目
```bash
git clone https://github.com/TheBlackGay/db-modeler.git
cd db-modeler
```

2. 后端服务
```bash
cd db-modeler-java
./mvnw spring-boot:run
```

3. 前端服务
```bash
cd db-modeler-ui
pnpm install
pnpm dev
```

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (git checkout -b feature/AmazingFeature)
3. 提交你的更改 (git commit -m 'Add some AmazingFeature')
4. 推送到分支 (git push origin feature/AmazingFeature)
5. 开启一个 Pull Request

## 开发规范

### Git Commit 规范
- feat: 新功能
- fix: 修复问题
- docs: 文档修改
- style: 代码格式修改
- refactor: 代码重构
- test: 测试用例修改
- chore: 其他修改

### 代码风格
- 前端遵循 Vue 3 + TypeScript 推荐的编码规范
- 后端遵循 Google Java Style Guide

## 许可证

[MIT](LICENSE)