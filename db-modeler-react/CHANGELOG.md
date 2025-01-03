# DB Modeler 开发日志

## v0.1.1 (2024-01-15)

### 功能改进

#### 1. 项目管理
- [x] 修复项目编辑对话框无法显示现有项目信息的问题
- [x] 优化项目编辑表单的状态管理
- [x] 改进项目列表的事件处理机制

#### 2. 表管理
- [x] 修复表编辑对话框无法显示现有表信息的问题
- [x] 修复点击编辑按钮时错误导航的问题
- [x] 优化表编辑表单的状态管理
- [x] 改进表列表的事件处理机制

#### 3. SQL导出功能
- [x] 支持MySQL和PostgreSQL数据库
- [x] 支持自定义字符集和排序规则
- [x] 支持表注释和字段注释
- [x] 支持主键和自增设置
- [x] 支持存储引擎选择（MySQL）

#### 4. 用户体验优化
- [x] 优化下拉菜单的事件冒泡处理
- [x] 改进表单重置和初始值设置
- [x] 优化编辑对话框的交互体验
- [x] 优化SQL导出对话框的布局和选项

### 技术改进
- [x] 优化 Redux 状态管理
- [x] 改进事件处理机制
- [x] 完善单元测试覆盖
- [x] 新增 SQLGenerator 工具类及其测试

## v0.1.0 (2024-01-15)

### 功能实现

#### 1. 项目管理
- [x] 项目列表展示
- [x] 创建新项目
- [x] 编辑项目
- [x] 删除项目
- [x] 项目导入/导出

#### 2. 表管理
- [x] 项目详情页面
- [x] 表列表展示
- [x] 创建新表
- [x] 表基本信息展示（名称、注释、字段数量等）

#### 3. 字段管理
- [x] 表设计页面
- [x] 字段列表展示
- [x] 添加新字段
- [x] 编辑字段
- [x] 删除字段
- [x] 字段属性设置（类型、长度、是否可空等）

#### 4. 数据存储
- [x] Redux 状态管理
- [x] LocalStorage 持久化
- [x] 项目导入导出功能

### 项目结构

```
src/
├── components/
│   ├── Layout/            # 全局布局组件
│   ├── ProjectList/       # 项目列表页面
│   ├── ProjectDetail/     # 项目详情页面
│   ├── TableDesigner/     # 表设计页面
│   └── FieldForm/         # 字段表单组件
├── store/
│   ├── index.ts           # Redux store 配置
│   └── projectsSlice.ts   # 项目状态管理
├── services/
│   └── storage.ts         # 本地存储服务
├── types/
│   └── models.ts          # 类型定义
└── utils/
    └── helpers.ts         # 工具函数
```

### 技术栈

- React 18
- TypeScript
- Redux Toolkit
- React Router v6
- Ant Design v5
- TailwindCSS
- Vite
- Jest

### 待实现功能

#### v0.2.0 计划
- [ ] 侧边栏导航
- [ ] 表关系管理
- [ ] SQL 导出功能
- [ ] 数据库连接配置
- [ ] 在线同步到数据库

#### v0.3.0 计划
- [ ] 字段高级属性（索引、外键等）
- [ ] 表预览功能
- [ ] 数据库反向工程
- [ ] 项目模板功能
- [ ] 协作功能

### 已知问题

1. 暂无已知问题

### 文档

#### 页面结构

1. 布局组件 (`Layout`)
- 路径：`src/components/Layout/index.tsx`
- 功能：提供全局布局结构
- 组件：
  - Ant Design `Layout`
  - `Header`：显示应用标题
  - `Sider`：侧边栏（预留）
  - `Content`：主内容区域

2. 项目列表页 (`ProjectList`)
- 路径：`src/components/ProjectList/index.tsx`
- 路由：`/`
- 功能：显示所有项目，管理项目的创建、编辑、删除和导入导出
- 组件：
  - `List`：项目列表
  - `Card`：项目卡片
  - `Modal`：新建/编辑项目弹窗
  - `Button`：操作按钮
  - `Dropdown`：项目操作菜单
- Redux Actions:
  - `addProject`：创建项目
  - `updateProject`：更新项目
  - `deleteProject`：删除项目
  - `importProject`：导入项目
  - `setCurrentProject`：设置当前项目
- 存储接口：
  - `exportProject`：导出项目到文件
  - `importProjectFile`：从文件导入项目

3. 项目详情页 (`ProjectDetail`)
- 路径：`src/components/ProjectDetail/index.tsx`
- 路由：`/project/:id`
- 功能：显示项目信息和表列表，管理表的创建
- 组件：
  - `Card`：表卡片
  - `List`：表列表
  - `Modal`：创建表弹窗
  - `Button`：创建表按钮
- Redux Actions:
  - `setCurrentProject`：设置当前项目
  - `addTable`：创建表

4. 表设计页 (`TableDesigner`)
- 路径：`src/components/TableDesigner/index.tsx`
- 路由：`/table/:id`
- 功能：设计表结构，管理字段
- 组件：
  - `Table`：字段列表
  - `Card`：表信息卡片
  - `Modal`：确认删除弹窗
  - `FieldForm`：字段表单组件
- Redux Actions:
  - `addField`：添加字段
  - `updateField`：更新字段
  - `deleteField`：删除字段

5. 字段表单组件 (`FieldForm`)
- 路径：`src/components/FieldForm/index.tsx`
- 功能：字段的创建和编辑表单
- 组件：
  - `Modal`：表单弹窗
  - `Form`：字段表单
  - `Select`：数据类型选择
  - `Input`：字段属性输入
  - `Switch`：是否允许为空开关

#### 数据流

1. Redux Store
- 路径：`src/store/index.ts`
- Slices:
  - `projectsSlice`：项目相关状态管理

2. 本地存储
- 路径：`src/services/storage.ts`
- 功能：
  - 项目数据的本地存储
  - 项目的导入导出

#### 数据模型

1. 项目 (Project)
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  tables: Table[];
  createdAt: string;
  updatedAt: string;
}
```

2. 表 (Table)
```typescript
interface Table {
  id: string;
  name: string;
  fields: Field[];
  comment?: string;
  createdAt: string;
  updatedAt: string;
}
```

3. 字段 (Field)
```typescript
interface Field {
  id: string;
  name: string;
  type: string;
  length?: number;
  nullable: boolean;
  defaultValue?: string | null;
  comment?: string;
}
```

#### 交互流程

1. 项目管理流程：
   - 首页查看所有项目
   - 创建/编辑/删除项目
   - 导入/导出项目

2. 表管理流程：
   - 进入项目详情页
   - 查看项目下的所有表
   - 创建新表

3. 字段管理流程：
   - 进入表设计页
   - 添加/编辑/删除字段
   - 设置字段属性（类型、长度、是否可空等） 

## v0.6.0 (2024-01-16)

### 测试框架优化

#### 1. Mock组件实现
- [x] 实现 Ant Design 组件的 Mock 版本
- [x] 优化表单组件的状态管理
- [x] 改进事件处理机制
- [x] 添加 ARIA 属性支持

#### 2. 测试用例改进
- [x] 使用更精确的角色查询
- [x] 优化测试等待机制
- [x] 改进表单状态测试
- [x] 完善组件交互测试

#### 3. 技术改进
- [x] 优化 Mock 组件的状态同步
- [x] 改进表单值处理机制
- [x] 完善测试覆盖率
- [x] 优化测试代码结构

### 已知问题修复
- [x] 修复表单初始值不正确的问题
- [x] 修复开关组件状态同步问题
- [x] 修复表单重置功能
- [x] 修复模态框标题显示问题

# 更新日志

## [0.6.0] - 2023-12-19

### 新增
- 表设计页面全新UI和交互体验
  - 添加字段统计和状态展示
  - 字段属性分组展示
  - 未保存更改提醒功能
  - 表格展示优化
- 新增字段模板功能
- 新增数据库连接管理

### 优化
- 改进整体颜色方案和视觉效果
- 优化表单布局和样式
- 优化项目列表展示
- 改进导航体验

### 修复
- 修复项目创建和编辑的问题
- 修复表格保存时的验证问题
- 修复字段重复检查的问题