# 版本规划

## 当前版本 [v0.6.0]

### 已完成功能
- ✅ 项目管理基础功能
  - ✅ 项目CRUD操作
  - ✅ 项目导入/导出
  - ✅ 项目列表展示
- ✅ 表设计基础功能
  - ✅ 表CRUD操作
  - ✅ 表基本信息管理
  - ✅ 表列表展示
- ✅ 字段管理功能
  - ✅ 字段CRUD操作
  - ✅ 字段属性设置
  - ✅ 字段验证规则
- ✅ 数据库连接管理
  - ✅ 多数据库类型支持
  - ✅ 连接测试功能
  - ✅ 连接历史记录
- ✅ 表设计页面UI优化
  - ✅ 字段列表展示优化
  - ✅ 表单交互优化
  - ✅ 响应式布局
- ✅ 字段模板功能
  - ✅ 内置字段模板
  - ✅ 自定义模板管理
  - ✅ 模板分类

### 进行中功能
- 🚧 SQL导出功能 (70%)
  - ✅ MySQL导出支持
  - ✅ PostgreSQL导出支持
  - 🚧 Oracle导出支持
  - 🚧 SQL Server导出支持
- 🚧 数据库同步功能 (40%)
  - ✅ DDL解析基础功能
  - 🚧 数据库反向工程
  - 🚧 结构对比功能
- 🚧 字段批量编辑 (30%)
  - 🚧 批量属性修改
  - 🚧 批量导入功能
- 🚧 接口调试功能 (20%)
  - ✅ 基础请求发送
  - 🚧 请求参数管理
  - 🚧 响应数据处理

### 技术债务
- 🔄 ER图性能优化
- 🔄 状态管理优化
- 🔄 测试覆盖率提升
- 🔄 错误处理机制完善

## 下一版本 [v0.7.0] 计划

### 优先级 P0（必须完成）
- [ ] SQL导出功能完善
  - [ ] Oracle导出支持完成
  - [ ] SQL Server导出支持完成
  - [ ] 批量导出功能
  - [ ] 导出模板自定义
- [ ] 数据库同步功能
  - [ ] 完成数据库反向工程
  - [ ] 完成结构对比功能
  - [ ] 支持增量同步
- [ ] 字段批量编辑
  - [ ] 完成批量属性修改
  - [ ] 完成批量导入功能
  - [ ] Excel导入支持

### 优先级 P1（重要）
- [ ] 接口调试功能基础版
  - [ ] 完成请求参数管理
  - [ ] 完成响应数据处理
  - [ ] 支持基础认证方式
  - [ ] 支持环境变量
- [ ] ER图功能增强
  - [ ] 性能优化
  - [ ] 自定义样式支持
  - [ ] 关系编辑功能
- [ ] 测试覆盖率提升
  - [ ] 核心功能单元测试
  - [ ] E2E测试框架搭建
  - [ ] 关键路径测试用例

### 优先级 P2（可选）
- [ ] UI/UX改进
  - [ ] 深色模式支持
  - [ ] 键盘快捷键
  - [ ] 自定义主题
- [ ] 文档功能
  - [ ] 数据字典生成
  - [ ] API文档生成
  - [ ] Markdown导出

### 技术改进
- [ ] 状态管理重构
  - [ ] 使用Redux Toolkit Query
  - [ ] 优化状态更新逻辑
  - [ ] 引入不可变数据结构
- [ ] 性能优化
  - [ ] 组件懒加载
  - [ ] 虚拟滚动
  - [ ] 大数据渲染优化

### 已调整计划
- 推迟到v0.8.0版本的功能：
  - 团队协作功能
  - 高级Mock功能
  - 自动化测试功能
  - 性能测试功能

### 技术债务
- 🔄 错误处理机制完善

### 接口管理功能
- [ ] EOLINKER表设计与实现
  - [ ] 接口基本信息表（eolinker_api）
    - [ ] id: string (主键)
    - [ ] project_id: string (关联项目ID)
    - [ ] name: string (接口名称)
    - [ ] description: string (接口描述)
    - [ ] url: string (接口URL)
    - [ ] method: enum (GET/POST/PUT/DELETE/PATCH)
    - [ ] group_id: string (分组ID)
    - [ ] tags: string[] (标签列表)
    - [ ] status: enum (developing/completed/deprecated)
    - [ ] version: string (接口版本)
    - [ ] created_at: timestamp
    - [ ] updated_at: timestamp
    - [ ] created_by: string
    - [ ] updated_by: string

  - [ ] 接口参数表（eolinker_api_param）
    - [ ] id: string (主键)
    - [ ] api_id: string (关联接口ID)
    - [ ] name: string (参数名称)
    - [ ] type: enum (string/number/boolean/object/array/file/enum)
    - [ ] param_in: enum (query/header/path/body/formData)
    - [ ] description: string (参数描述)
    - [ ] required: boolean (是否必填)
    - [ ] example: string (示例值)
    - [ ] default_value: string (默认值)
    - [ ] parent_id: string (父参数ID，用于嵌套参数)
    - [ ] order: integer (参数顺序)
    - [ ] rules: jsonb (验证规则)
    - [ ] created_at: timestamp
    - [ ] updated_at: timestamp

  - [ ] 接口响应表（eolinker_api_response）
    - [ ] id: string (主键)
    - [ ] api_id: string (关联接口ID)
    - [ ] status_code: integer (HTTP状态码)
    - [ ] description: string (响应描述)
    - [ ] schema: jsonb (响应数据结构)
    - [ ] example: jsonb (响应示例)
    - [ ] is_default: boolean (是否默认响应)
    - [ ] created_at: timestamp
    - [ ] updated_at: timestamp

  - [ ] 错误码表（eolinker_error_code）
    - [ ] id: string (主键)
    - [ ] project_id: string (关联项目ID)
    - [ ] code: string (错误码)
    - [ ] message: string (错误信息)
    - [ ] description: string (错误描述)
    - [ ] solution: string (解决方案)
    - [ ] created_at: timestamp
    - [ ] updated_at: timestamp

  - [ ] 接口测试历史表（eolinker_api_test_history）
    - [ ] id: string (主键)
    - [ ] api_id: string (关联接口ID)
    - [ ] request: jsonb (请求数据)
    - [ ] response: jsonb (响应数据)
    - [ ] status_code: integer (响应状态码)
    - [ ] duration: integer (请求耗时，单位ms)
    - [ ] test_at: timestamp (测试时间)
    - [ ] tested_by: string (测试人员)
    - [ ] environment: string (测试环境)
    - [ ] result: enum (success/failed)
    - [ ] error_message: string (错误信息)

  - [ ] Mock配置表（eolinker_mock_config）
    - [ ] id: string (主键)
    - [ ] api_id: string (关联接口ID)
    - [ ] enabled: boolean (是否启用)
    - [ ] delay: integer (模拟延迟，单位ms)
    - [ ] rules: jsonb (Mock规则配置)
    - [ ] created_at: timestamp
    - [ ] updated_at: timestamp

  - [ ] 接口分组表（eolinker_api_group）
    - [ ] id: string (主键)
    - [ ] project_id: string (关联项目ID)
    - [ ] name: string (分组名称)
    - [ ] description: string (分组描述)
    - [ ] parent_id: string (父分组ID)
    - [ ] order: integer (分组顺序)
    - [ ] created_at: timestamp
    - [ ] updated_at: timestamp

  - [ ] 功能实现计划
    - [ ] 基础API管理
      - [ ] 接口CRUD操作
      - [ ] 参数管理
      - [ ] 响应管理
      - [ ] 分组管理
    - [ ] 高级功能
      - [ ] 接口测试
      - [ ] Mock服务
      - [ ] 文档导出
      - [ ] 版本控制
    - [ ] 数据迁移
      - [ ] 历史数据导入
      - [ ] 数据结构升级
      - [ ] 数据一致性检查

### UI/UX改进
- [ ] 深色模式支持
- [ ] 自定义主题
- [ ] 响应式布局优化
- [ ] 键盘快捷键支持

### 性能优化
- [ ] 大型项目加载优化
- [ ] 状态管理优化
- [ ] 缓存机制改进

## 未来版本 [v1.0.0] 展望

### 核心功能
- [ ] 表关系管理
  - [ ] 可视化关系图
  - [ ] 关系约束管理
  - [ ] 关系验证
- [ ] 版本控制
  - [ ] 变更历史
  - [ ] 版本回滚
  - [ ] 协作支持
- [ ] 数据字典
  - [ ] 字段说明管理
  - [ ] 文档导出
  - [ ] 在线预览

### 高级功能
- [ ] 数据库迁移
  - [ ] 迁移脚本生成
  - [ ] 迁移计划管理
  - [ ] 回滚支持
- [ ] 团队协作
  - [ ] 多用户支持
  - [ ] 权限管理
  - [ ] 操作日志
- [ ] API文档生成
  - [ ] RESTful API文档
  - [ ] 接口测试
  - [ ] 文档导出

### 工具集成
- [ ] 代码生成器
  - [ ] ORM实体生成
  - [ ] API代码生成
  - [ ] 自定义模板
- [ ] CI/CD集成
  - [ ] 自动化部署
  - [ ] 测试集成
  - [ ] 监控集成

## 发布周期

### v0.7.0 计划
- Alpha版本：2024年2月初
- Beta版本：2024年2月中旬
- RC版本：2024年2月底
- 正式版本：2024年3月初

### 常规发布节奏
- 功能迭代：每2周发布一个小版本
- Bug修复：每周发布一个修订版本
- 重大版本：每季度发布一个大版本

## 技术栈规划

### 前端（当前）
- ✅ React 18.2
- ✅ TypeScript 5.2
- ✅ Ant Design 5.11
- ✅ Redux Toolkit 1.9
- ✅ React Router 6.20
- ✅ TailwindCSS 3.3
- ✅ Vite 5.0

### 前端（计划升级）
- 🔄 引入 React Query
- 🔄 升级到 TypeScript 5.3
- 🔄 引入 Storybook
- 🔄 集成 Cypress

### 开发工具链
- ✅ ESLint 8.55
- ✅ Prettier 3.1
- ✅ Husky 8.0
- ✅ Jest 29.7
- 🔄 引入 Playwright
- 🔄 引入 React Testing Library

### 代码质量
- 单元测试覆盖率目标：80%
- E2E测试覆盖关键功能
- 代码审查流程优化
- 自动化测试CI集成

## 版本命名规则

- 主版本号：重大功能变更和架构升级
- 次版本号：新功能添加和重要优化
- 修订版本号：bug修复和小优化

## 技术栈规划

### 前端
- React 18
- TypeScript 5
- Ant Design 5
- Redux Toolkit
- React Router 6
- TailwindCSS

### 后端
- Spring Boot 3
- Java 17
- MySQL 8
- Redis
- MyBatis Plus

### 开发工具
- Vite
- Jest
- ESLint
- Prettier
- Husky 