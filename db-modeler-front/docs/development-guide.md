# DB-Modeler 开发指南

## 1. 环境搭建

### 1.1 系统要求

- Node.js >= 16.0.0
- pnpm >= 7.0.0 (必须使用 pnpm，不支持 npm/yarn)
- Redis >= 6.0
- 支持的数据库：
  - MySQL >= 5.7
  - PostgreSQL >= 12
  - SQLite >= 3
  - MS SQL >= 2017
  - Oracle >= 12c

### 1.2 开发环境设置

1. **安装 pnpm**
```bash
# 使用 npm 安装 pnpm
npm install -g pnpm

# 验证安装
pnpm --version
```

2. **克隆代码库**
```bash
git clone <repository-url>
cd db-modeler
```

3. **安装依赖**
```bash
# 后端依赖
pnpm install

# 前端依赖
cd frontend
pnpm install
```

4. **环境变量配置**
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件
DATABASE_URL=postgresql://user:password@localhost:5432/dbmodeler
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
```

5. **数据库设置**
```bash
# 创建数据库
node create_db.js

# 运行迁移
pnpm run migrate
```

### 1.3 端口配置（⚠️ 重要）

**固定端口配置（禁止修改）：**
- 前端服务: 3001
- 后端服务: 5001

> ⚠️ **警告**：这些端口配置是固定的，请勿修改。修改端口可能会导致前后端通信失败和其他未知问题。

### 1.4 启动服务

使用提供的启动脚本：

```bash
# 启动后端服务（端口 5001）
./restart-backend.sh

# 启动前端服务（端口 3001）
./restart-frontend.sh
```

注意：
- 必须使用项目提供的重启脚本来启动服务
- 重启脚本会自动处理依赖安装、环境配置和服务启动
- 不要直接使用 pnpm run dev 来启动服务

## 2. 开发规范

### 2.1 代码风格

#### 2.1.1 TypeScript/JavaScript

```typescript
// 使用 interface 定义类型
interface User {
  id: string;
  username: string;
  email: string;
}

// 使用 async/await 处理异步
async function getUser(id: string): Promise<User> {
  try {
    const user = await UserService.findById(id);
    return user;
  } catch (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
}
```

#### 2.1.2 React 组件

```typescript
// 使用函数组件和 hooks
import React, { useState, useEffect } from 'react';

interface Props {
  userId: string;
}

const UserProfile: React.FC<Props> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const data = await getUser(userId);
      setUser(data);
    };
    loadUser();
  }, [userId]);

  return (
    <div>
      {user && <h1>{user.username}</h1>}
    </div>
  );
};
```

### 2.2 命名规范

- **文件命名**：使用 PascalCase 命名组件文件，使用 camelCase 命名其他文件
- **变量命名**：使用有意义的描述性名称
- **常量命名**：使用大写字母和下划线
- **类型命名**：使用 PascalCase

### 2.3 注释规范

```typescript
/**
 * 用户服务类
 * @class UserService
 */
class UserService {
  /**
   * 根据ID查找用户
   * @param {string} id - 用户ID
   * @returns {Promise<User>} 用户对象
   * @throws {Error} 当用户不存在时
   */
  async findById(id: string): Promise<User> {
    // 实现代码
  }
}
```

## 3. 构建和部署

### 3.1 构建流程

```bash
# 前端构建
cd frontend
pnpm run build

# 后端构建
pnpm run build
```

### 3.2 部署步骤

1. **准备服务器环境**
```bash
# 安装 Node.js
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
pnpm install -g pm2
```

2. **配置 Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **启动应用**
```bash
# 使用 PM2 启动
pm2 start ecosystem.config.js
```

## 4. 测试指南

### 4.1 单元测试

```typescript
// user.test.ts
import { UserService } from './UserService';

describe('UserService', () => {
  it('should find user by id', async () => {
    const user = await UserService.findById('123');
    expect(user).toBeDefined();
    expect(user.id).toBe('123');
  });
});
```

### 4.2 集成测试

```typescript
// api.test.ts
import request from 'supertest';
import app from './app';

describe('API Tests', () => {
  it('should create new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        username: 'test',
        email: 'test@example.com'
      });
    expect(response.status).toBe(201);
  });
});
```

### 4.3 端到端测试

```typescript
// e2e/login.test.ts
describe('Login Flow', () => {
  it('should login successfully', async () => {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'test');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });
});
```

## 5. 调试技巧

### 5.1 前端调试

- 使用 React Developer Tools
- 使用 Chrome DevTools
- 使用 VSCode 调试器

### 5.2 后端调试

- 使用 Node.js 调试器
- 使用 VSCode 调试配置
- 使用日志调试

### 5.3 数据库调试

- 使用数据库客户端工具
- SQL 查询优化
- 性能分析

## 6. 常见问题解决

### 6.1 依赖问题

```bash
# 清理依赖缓存
pnpm cache clean --force

# 重新安装依赖
rm -rf node_modules
pnpm install
```

### 6.2 构建问题

```bash
# 清理构建缓存
pnpm run clean

# 检查 TypeScript 编译错误
pnpm run type-check
```

## 7. 贡献指南

### 7.1 提交规范

```bash
# 提交格式
type(scope): subject

# 示例
feat(user): add user authentication
fix(api): fix connection timeout
docs(readme): update installation guide
```

### 7.2 分支管理

- main: 主分支
- develop: 开发分支
- feature/*: 功能分支
- hotfix/*: 紧急修复分支

### 7.3 代码审查

- 创建 Pull Request
- 代码审查清单
- 合并规则
- 测试要求
