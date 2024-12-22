# 版本规划

## 当前版本 [v0.6.0]

### 已完成功能
- ✅ 项目管理基础功能
- ✅ 表设计基础功能
- ✅ 字段管理功能
- ✅ 数据库连接管理
- ✅ 表设计页面UI优化
- ✅ 字段模板功能

### 进行中功能
- 🚧 SQL导出功能
- 🚧 数据库同步功能
- 🚧 字段批量编辑

## 下一版本 [v0.7.0] 计划

### 功能增强
- [ ] 完善SQL导出功能
  - [ ] 支持多种数据库方言
  - [ ] 自定义SQL模板
  - [ ] 批量导出功能
- [ ] 数据库同步功能
  - [ ] 支持从现有数据库导入表结构
  - [ ] 支持将设计同步到数据库
  - [ ] 结构对比和差异处理
- [ ] 字段管理增强
  - [ ] 字段批量编辑
  - [ ] 字段模板管理
  - [ ] 字段依赖关系

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

- Alpha版本：每周发布
- Beta版本：每两周发布
- 正式版本：每月发布
- 重大版本：每季度发布

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