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