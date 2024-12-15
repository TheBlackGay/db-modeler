# DB-Modeler-React 开发指南

## 开发环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0
- Git

## 项目设置
1. 克隆项目
```bash
git clone <repository-url>
cd db-modeler-react
```

2. 安装依赖
```bash
pnpm install
```

3. 启动开发服务器
```bash
pnpm run dev
```

## 开发规范

### 1. 代码风格
- 使用TypeScript编写所有代码
- 遵循ESLint规则
- 使用Prettier进行代码格式化
- 组件采用函数式组件和Hooks

### 2. 文件命名规范
- 组件文件：PascalCase（如：TableList.tsx）
- 工具函数文件：camelCase（如：formatDate.ts）
- 样式文件：与组件同名（如：TableList.css）
- 类型定义文件：camelCase（如：model.ts）

### 3. 目录结构
```
src/
  ├── components/        # 可复用组件
  ├── pages/            # 页面组件
  ├── store/            # Redux相关
  ├── services/         # 服务层
  ├── types/            # 类型定义
  ├── utils/            # 工具函数
  ├── hooks/            # 自定义Hooks
  └── assets/           # 静态资源
```

### 4. Git提交规范
提交信息格式：
```
<type>(<scope>): <subject>

<body>

<footer>
```

类型（type）：
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式（不影响代码运行的变动）
- refactor: 重构
- test: 测试
- chore: 构建过程或辅助工具的变动

### 5. 组件开发规范
- 组件应该是纯函数
- Props使用TypeScript接口定义
- 使用自定义Hooks抽取业务逻辑
- 组件应该是可复用的
- 避免过度嵌套

### 6. 状态管理规范
- 使用Redux Toolkit管理全局状态
- 使用Redux Thunk处理异步操作
- 按功能模块拆分Slice
- 使用TypeScript定义Action和State类型

### 7. 测试规范
- 编写单元测试（使用Jest和React Testing Library）
- 测试文件命名：*.test.tsx 或 *.spec.tsx
- 保持测试覆盖率
- 模拟复杂的外部依赖

## 开发流程

### 1. 功能开发
1. 从main分支创建新的功能分支
2. 开发新功能
3. 编写测试
4. 提交代码
5. 创建Pull Request

### 2. 代码审查
- 确保所有测试通过
- 符合代码规范
- 代码逻辑清晰
- 文档完善

### 3. 版本发布
1. 更新版本号
2. 更新CHANGELOG
3. 创建Release Tag
4. 部署新版本

## 调试指南

### 1. 开发工具
- 使用React Developer Tools
- 使用Redux DevTools
- 使用Chrome DevTools

### 2. 日志级别
- ERROR: 错误信息
- WARN: 警告信息
- INFO: 一般信息
- DEBUG: 调试信息

## 文档维护
- 及时更新API文档
- 维护CHANGELOG
- 更新README
- 编写组件文档

## 性能优化
- 使用React.memo()优化渲染
- 使用useMemo和useCallback
- 实现代码分割
- 优化打包大小
- 使用性能分析工具 