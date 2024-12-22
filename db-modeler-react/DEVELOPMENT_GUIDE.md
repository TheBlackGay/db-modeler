# DB Modeler 开发指南

## 项目概述
DB Modeler 是一个基于 React + TypeScript 的数据库模型设计工具，支持数据表的可视化设计、字段管理、SQL导出等功能。

## 技术栈
- React 18
- TypeScript 5
- Redux Toolkit
- React Router v6
- Ant Design v5
- TailwindCSS
- Vite
- Jest + Testing Library

## 开发环境搭建

### 系统要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装依赖
```bash
pnpm install
```

### 开发服务器启动
```bash
pnpm dev
```

### 构建项目
```bash
pnpm build
```

### 运行测试
```bash
pnpm test
```

## 项目结构
```
src/
├── components/        # React组件
├── store/            # Redux状态管理
├── services/         # 服务层
├── types/            # TypeScript类型定义
└── utils/            # 工具函数
```

## 开发规范

### 代码风格
- 使用 ESLint 和 Prettier 进行代码格式化
- 遵循 TypeScript 严格模式
- 使用函数式组件和 Hooks

### 组件开发规范
1. 组件文件命名采用大驼峰（PascalCase）
2. 组件目录结构：
```
ComponentName/
├── index.tsx         # 组件主文件
├── styles.css        # 样式文件（如果需要）
└── __tests__/       # 测试文件
    └── ComponentName.test.tsx
```

### 状态管理规范
1. 使用 Redux Toolkit 进行状态管理
2. Slice 文件命名采用小驼峰（camelCase）
3. Action 类型使用 `domain/action` 格式

### 测试规范
1. 使用 Jest 和 Testing Library 编写测试
2. 测试文件命名：`*.test.tsx` 或 `*.test.ts`
3. 测试覆盖率要求：
   - 语句覆盖率 > 80%
   - 分支覆盖率 > 80%
   - 函数覆盖率 > 90%

### 组件测试指南
1. 组件测试原则：
   - 测试组件的用户交互
   - 测试组件的渲染输出
   - 测试组件的状态变化
   - 测试组件的错误处理

2. 测试用例编写：
```typescript
describe('组件名称', () => {
  // 基础渲染测试
  it('应该正确渲染组件', () => {
    // 测试代码
  });

  // 用户交互测试
  it('应该正确响应用户操作', () => {
    // 测试代码
  });

  // 状态变化测试
  it('应该正确更新状态', () => {
    // 测试代码
  });

  // 错误处理测试
  it('应该正确处理错误情况', () => {
    // 测试代码
  });
});
```

3. Mock 数据和依赖：
   - 使用 `jest.mock()` 模拟外部依赖
   - 使用 `jest.spyOn()` 监视函数调用
   - 使用 `mockImplementation()` 模拟函数行为
   - 使用 `mockResolvedValue()` 模拟异步操作

4. 常用测试工具：
   - `render`: 渲染组件
   - `screen`: 查询元素
   - `fireEvent`: 触发事件
   - `waitFor`: 等待异步操作
   - `act`: 包装状态更新

5. 测试示例：
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <MyComponent />
      </Provider>
    );
  };

  it('应该正确渲染表单', () => {
    renderComponent();
    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('应该正确处理表单提交', async () => {
    renderComponent();
    fireEvent.click(screen.getByText('提交'));
    await waitFor(() => {
      expect(screen.getByText('提交成功')).toBeInTheDocument();
    });
  });
});
```

## Git 工作流

### 分支管理
- main: 主分支，用于发布
- develop: 开发分支
- feature/*: 功能分支
- bugfix/*: 修复分支
- release/*: 发布分支

### 提交规范
提交信息格式：
```
<type>(<scope>): <subject>

<body>

<footer>
```

type 类型：
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式（不影响代码运行的变动）
- refactor: 重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

### 版本发布流程
1. 从 develop 分支创建 release 分支
2. 在 release 分支进行测试和 bug 修复
3. 合并到 main 分支并打 tag
4. 合并回 develop 分支

## 部署指南

### 构建
```bash
pnpm build
```

### 环境变量
- `VITE_API_URL`: API地址
- `VITE_ENV`: 环境标识（development/production）

### 部署检查清单
- [ ] 环境变量配置
- [ ] 构建产物验证
- [ ] 性能测试
- [ ] 兼容性测试
- [ ] 安全检查

## 常见问题

### 开发环境问题
1. 依赖安装失败
   - 清除 pnpm store: `pnpm store prune`
   - 删除 node_modules: `rm -rf node_modules`
   - 重新安装: `pnpm install`

2. 开发服务器启动失败
   - 检查端口占用
   - 检查环境变量配置
   - 检查 vite.config.ts 配置

### 测试相关问题
1. 测试超时
   - 增加超时时间配置
   - 检查异步操作处理

2. 测试失败
   - 检查测试环境配置
   - 更新快照: `pnpm test -u`

## 开发指南

### 文件目录规范

```
src/
├── assets/                # 静态资源文件
│   ├── images/           # 图片资源
│   ├── styles/           # 全局样式
│   └── icons/            # 图标资源
│
├── components/           # 全局通用组件
│   ├── common/          # 基础UI组件
│   ├── business/        # 业务通用组件
│   └── layout/          # 布局相关组件
│
├── features/            # 功能模块
│   ├── project/         # 项目管理模块
│   │   ├── components/  # 模块专用组件
│   │   ├── hooks/       # 模块专用钩子
│   │   ├── services/    # 模块专用服务
│   │   └── types/       # 模块专用类型
│   │
│   ├── database/        # 数据库管理模块
│   └── eolinker/        # 接口管理模块
│
├── hooks/               # 全局通用钩子
├── services/            # 全局服务和API
├── store/               # 状态管理
├── types/               # 全局类型定义
├── utils/               # 工具函数
└── pages/               # 页面组件
```

### 文件命名规范

#### 1. 目录命名
- 使用小写字母
- 多个单词用连字符（-）连接
- 例如：`api-manager`, `table-designer`

#### 2. 组件文件命名
- 使用 PascalCase（大驼峰）
- 组件名应该与文件名完全匹配
- 例如：`TableDesigner.tsx`, `ApiManager.tsx`

#### 3. 类型文件命名
- 使用 `.types.ts` 后缀
- 例如：`api.types.ts`, `project.types.ts`

#### 4. 工具文件命名
- 使用小写字母
- 多个单词用连字符（-）连接
- 例如：`string-utils.ts`, `date-formatter.ts`

#### 5. 样式文件命名
- 使用模块化CSS，文件名与组件名对应
- 使用 `.module.css` 或 `.module.scss` 后缀
- 例如：`TableDesigner.module.scss`

#### 6. 测试文件命名
- 使用 `.test.ts` 或 `.spec.ts` 后缀
- 文件名应与被测试文件对应
- 例如：`TableDesigner.test.tsx`

### 文件组织规则

#### 1. 组件文件结构
```
features/eolinker/
├── components/
│   ├── ApiForm/
│   │   ├── index.tsx
│   │   ├── ApiForm.types.ts
│   │   ├── ApiForm.module.scss
│   │   └── ApiForm.test.tsx
│   └── ApiGroupForm/
│       ├── index.tsx
│       ├── ApiGroupForm.types.ts
│       ├── ApiGroupForm.module.scss
│       └── ApiGroupForm.test.tsx
├── services/
│   └── api.service.ts
└── types/
    └── api.types.ts
```

#### 2. 模块化原则
- 相关的文件应该放在同一个目录下
- 每个功能模块应该是独立的，包含自己的组件、类型和服务
- 共享的代码应该提升到上层目录

#### 3. 导入导出规则
- 每个目录都应该有一个 `index.ts` 文件统一导出
- 避免循环依赖
- 使用相对路径导入模块内的文件
- 使用绝对路径导入其他模块的文件

#### 4. 类型文件组织
- 全局类型定义放在 `src/types` 目录下
- 模块专用类型定义放在模块的 `types` 目录下
- 组件专用类型定义可以直接放在组件文件中或单独的类型文件中

### 代码风格规范

#### 1. TypeScript
- 优先使用 `interface` 而不是 `type`
- 使用明确的类型注解
- 避免使用 `any`

#### 2. React
- 使用函数组件和 Hooks
- 组件属性使用 interface 定义
- 使用 memo 优化渲染性能

#### 3. 样式
- 使用 CSS Modules
- 遵循 BEM 命名规范
- 避免内联样式

#### 4. 注释规范
- 使用 JSDoc 格式注释
- 关键逻辑必须添加注释
- 复杂的类型定义需要添加说明

### 版本控制规范

#### 1. 分支命名
- 功能分支：`feature/功能名称`
- 修复分支：`fix/问题描述`
- 优化分支：`optimize/优化内容`

#### 2. 提交信息
- feat: 新功能
- fix: 修复问题
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动