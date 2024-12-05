# DB Modeler

## 项目描述
一个现代化的数据库建模和管理工具，使用Node.js构建。

## 技术栈
- Node.js
- Express.js
- Sequelize ORM
- SQLite
- Swagger UI

## 功能特性
- 多数据库类型支持
- RESTful API
- 数据库模型管理
- API文档

## 快速开始

### 安装依赖
```bash
npm install
```

### 运行开发服务器
```bash
npm run dev
```

### 访问API文档
浏览器打开 `http://localhost:3000/api-docs`

## 环境变量
在 `.env` 文件中配置：
- `PORT`: 服务器端口
- `DATABASE_URL`: 数据库连接字符串
- `JWT_SECRET`: JWT密钥

## 测试
```bash
npm test
```

## 构建
```bash
npm run build
```

## 许可证
MIT
