# DB-Modeler 开发手册

## 目录

- [1. 开发环境配置](#1-开发环境配置)
- [2. 项目结构](#2-项目结构)
- [3. 开发规范](#3-开发规范)
  - [3.1 Java 开发规范](#31-java-开发规范)
  - [3.2 前端开发规范](#32-前端开发规范)
  - [3.3 数据库规范](#33-数据库规范)
  - [3.4 API 设计规范](#34-api-设计规范)
  - [3.5 Git 使用规范](#35-git-使用规范)
- [4. 协作流程](#4-协作流程)
- [5. 测试规范](#5-测试规范)
- [6. 发布流程](#6-发布流程)
- [7. 代码质量控制](#7-代码质量控制)
- [8. 依赖管理规范](#8-依赖管理规范)
- [9. 前后端协作开发流程](#9-前后端协作开发流程)
- [10. 数据库配置模块](#10-数据库配置模块)

## 1. 开发环境配置

### 必需环境
- JDK 8
- Node.js 18.x 或更高版本
- Maven 3.8.x 或更高版本
- MySQL 8.0（必需，项目仅支持 MySQL 数据库）
- IDE 推荐：
  - 后端：IntelliJ IDEA（推荐）或 Eclipse
  - 前端：Visual Studio Code（推荐）或 WebStorm

### 环境配置要求

#### JDK 配置
- 必须使用 JDK 8
- 推荐使用 Oracle JDK，也可以使用 OpenJDK
- 设置 JAVA_HOME 环境变量
- 将 JDK bin 目录添加到 PATH 环境变量

#### MySQL 配置
- 版本：MySQL 8.0
- 字符集：utf8mb4
- 排序规则：utf8mb4_general_ci
- 必要的配置项：
  ```properties
  # my.cnf 配置建议
  [mysqld]
  character-set-server=utf8mb4
  collation-server=utf8mb4_general_ci
  default-storage-engine=INNODB
  max_allowed_packet=16M
  ```

### 本地开发环境搭建
1. 克隆项目：
```bash
git clone https://github.com/your-org/db-modeler.git
cd db-modeler
```

2. 后端环境：
```bash
cd db-modeler-java
mvn clean install
```

3. 前端环境：
```bash
cd db-modeler-ui
npm install
```

## 2. 项目结构

### 后端结构
```
db-modeler-java/
├── src/main/java/com/db/modeler/
│   ├── config/        # 配置类
│   ├── controller/    # 控制器
│   ├── service/       # 服务层
│   ├── repository/    # 数据访问层
│   ├── entity/        # 实体类
│   ├── dto/           # 数据传输对象
│   └── util/          # 工具类
└── src/test/         # 测试代码
```

### 前端结构
```
db-modeler-ui/
├── src/
│   ├── api/          # API 接口
│   ├── assets/       # 静态资源
│   ├── components/   # 公共组件
│   ├── router/       # 路由配置
│   ├── stores/       # 状态管理
│   ├── types/        # TypeScript 类型
│   ├── utils/        # 工具函数
│   └── views/        # 页面组件
```

## 3. 开发规范

### 3.1 Java 开发规范

基于阿里巴巴 Java 开发手册（黄山版）

#### 命名规范
- **类名**：使用 UpperCamelCase 风格
- **方法名**：使用 lowerCamelCase 风格
- **常量**：全部大写，单词间用下划线隔开
- **包名**：全部小写，点分隔符之间有且仅有一个自然语义的英语单词

#### 代码格式
- 使用 4 个空格缩进
- 每行代码不超过 120 个字符
- 方法体不超过 80 行
- 参数个数不超过 8 个

#### 注释规范
- 类、类属性、类方法必须使用 Javadoc 规范注释
- 方法内部单行注释使用 // 方式
```java
/**
 * 类描述
 *
 * @author 作者
 * @date 2024/12/07
 */
public class Example {
    /**
     * 方法描述
     *
     * @param param 参数说明
     * @return 返回值说明
     */
    public String method(String param) {
        // 单行注释
        return param;
    }
}
```

#### 异常处理
- 不要捕获 Exception，要捕获特定异常
- 有异常时，要么处理，要么抛出，不能忽略
- 禁止在 finally 块中使用 return

#### 代码行数限制
- 单个文件不超过 500 行
- 单个方法不超过 80 行
- 单个类不超过 400 行
- 超过限制时的拆分建议：
  - 提取通用逻辑到工具类
  - 使用设计模式拆分复杂逻辑
  - 将大型服务类拆分为多个小型服务类
- 示例拆分方式：
  ```
  service/
  ├── UserService.java              # 用户主服务
  ├── UserAuthenticationService.java # 用户认证服务
  ├── UserProfileService.java       # 用户档案服务
  └── UserPermissionService.java    # 用户权限服务
  ```

### 3.2 前端开发规范

基于 Vue.js 风格指南和 TypeScript 规范

#### 文件命名
- **组件文件**：使用 PascalCase，如 `UserProfile.vue`
- **工具文件**：使用 camelCase，如 `dateUtil.ts`
- **样式文件**：使用 kebab-case，如 `main-style.scss`

#### Vue 组件规范
- 组件名应该是多个单词的，根组件 App 除外
- Props 定义应该尽量详细
```typescript
interface Props {
  status: 'active' | 'inactive';
  title: string;
  count?: number;
}

defineProps<Props>()
```

#### TypeScript 规范
- 优先使用 `interface` 而不是 `type`
- 使用 `enum` 定义常量枚举
- 明确函数返回类型
```typescript
interface User {
  id: string;
  name: string;
}

function getUser(id: string): Promise<User> {
  return api.get(`/users/${id}`);
}
```

#### 样式规范
- 使用 BEM 命名规范
- 使用 SCSS 预处理器
- 避免使用内联样式
```scss
.block {
  &__element {
    &--modifier {
      // 样式
    }
  }
}
```

#### 代码行数限制
- 单个文件不超过 300 行
- 单个函数不超过 50 行
- 超过限制时应考虑拆分组件或提取公共逻辑
- 示例拆分方式：
  ```
  components/
  ├── UserList/
  │   ├── index.vue           # 主组件，负责组合子组件
  │   ├── UserTable.vue       # 表格展示组件
  │   ├── UserFilter.vue      # 筛选条件组件
  │   └── UserOperation.vue   # 操作按钮组件
  ```

### 3.3 数据库规范

#### 数据库要求
- 统一使用 MySQL 8.0
- 字符集统一使用 utf8mb4
- 排序规则使用 utf8mb4_general_ci
- 所有表必须使用 InnoDB 引擎

#### 命名规范
- 表名使用小写，单词间用下划线隔开
- 主键统一命名为 id，类型为 BIGINT UNSIGNED
- 外键命名为：关联表名_id
- 表名和字段名都使用英文，禁止使用拼音和中文
- 避免使用 MySQL 关键字
- 临时表以 tmp_ 开头
- 备份表以 bak_ 开头

#### 字段规范
- 必须有主键，推荐使用 BIGINT UNSIGNED AUTO_INCREMENT
- 所有字段必须添加 NOT NULL 约束，除非有特殊业务需求
- 用 TINYINT(1) 代替 BOOLEAN
- 存储精确浮点数使用 DECIMAL，禁止使用 FLOAT 和 DOUBLE
- 金额字段使用 DECIMAL(20,2)
- 时间字段使用 DATETIME 类型，禁止使用 TIMESTAMP
- 大字段和长文本字段必须独立表存储

#### 索引规范
- 主键索引名为 pk_字段名
- 唯一索引名为 uk_字段名
- 普通索引名为 idx_字段名
- 联合索引名称使用 idx_字段名1_字段名2
- 单表索引数量不超过 5 个
- 禁止在索引列上使用函数或进行计算

#### 示例
```sql
CREATE TABLE `user` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `username` varchar(50) NOT NULL COMMENT '用户名',
    `email` varchar(100) NOT NULL COMMENT '邮箱',
    `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态：1-启用，0-禁用',
    `created_at` datetime NOT NULL COMMENT '创建时间',
    `updated_at` datetime NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`),
    KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户表';
```

#### SQL 开发规范
- 禁止使用 SELECT *
- 禁止在 WHERE 条件中对字段进行函数转换和计算
- 禁止使用子查询，必要时可以使用 JOIN
- 禁止使用 OR 作为查询条件
- 使用 LIMIT 分页时，必须加 ORDER BY
- 统一使用 COUNT(*) 进行统计
- 使用 PREPARED STATEMENT 预编译语句

### 3.4 API 设计规范

基于 RESTful API 设计规范

#### URL 设计
- 使用名词而不是动词
- 使用复数形式
- 使用小写字母
- 使用连字符（-）而不是下划线（_）
```
GET    /api/users          # 获取用户列表
GET    /api/users/{id}     # 获取单个用户
POST   /api/users          # 创建用户
PUT    /api/users/{id}     # 更新用户
DELETE /api/users/{id}     # 删除用户
```

#### 响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": {
    // 响应数据
  }
}
```

#### 状态码使用
- 200：成功
- 201：创建成功
- 400：请求错误
- 401：未授权
- 403：禁止访问
- 404：资源不存在
- 500：服务器错误

### 3.5 Git 使用规范

#### 分支管理
- master：主分支，用于生产环境
- develop：开发分支
- feature/*：功能分支
- hotfix/*：紧急修复分支
- release/*：发布分支

#### Commit 信息规范
使用 Angular 团队的规范：
```
<type>(<scope>): <subject>

<body>

<footer>
```

type 类型：
- feat：新功能
- fix：修复 bug
- docs：文档修改
- style：代码格式修改
- refactor：重构代码
- test：添加测试
- chore：构建过程或辅助工具的变动

示例：
```
feat(user): add user login function

- Add login API
- Add login page
- Add login validation

Close #123
```

## 4. 协作流程

1. **任务分配**
   - 在项目管理工具中创建任务
   - 指定负责人和截止日期
   - 标注优先级和依赖关系

2. **开发流程**
   - 从 develop 分支创建功能分支
   - 本地开发和测试
   - 提交 Pull Request
   - 代码审查
   - 合并到 develop 分支

3. **代码审查清单**
   - 代码是否符合规范
   - 是否有适当的测试覆盖
   - 是否有适当的文档
   - 是否有性能问题
   - 是否有安全隐患

## 5. 测试规范

### 单元测试
- 使用 JUnit 5 进行后端测试
- 使用 Vitest 进行前端测试
- 测试覆盖率要求：
  - 核心业务代码：80%以上
  - 工具类：90%以上
  - API 接口：100%

### 集成测试
- 使用 Spring Boot Test
- 测试数据库使用 H2
- 测试覆盖所有 API 接口

### E2E 测试
- 使用 Cypress 进行端到端测试
- 覆盖核心业务流程
- 每次发布前必须通过所有 E2E 测试

## 6. 发布流程

1. **版本管理**
   - 使用语义化版本号：主版本号.次版本号.修订号
   - 记录版本变更日志

2. **发布准备**
   - 创建 release 分支
   - 更新版本号
   - 更新文档
   - 运行完整测试套件

3. **发布步骤**
   - 合并 release 分支到 master
   - 打标签
   - 部署到生产环境
   - 监控系统运行状况

4. **发布后**
   - 合并 master 到 develop
   - 关闭相关 issue
   - 更新项目文档

## 7. 代码质量控制

### 代码行数限制检查
- 在 CI/CD 流程中添加代码行数检查
- 使用 Git Hook 在提交时检查代码行数
- 定期使用工具扫描代码库，生成违规报告

### 工具配置

#### ESLint 配置（前端）
```json
{
  "rules": {
    "max-lines": ["error", {
      "max": 300,
      "skipBlankLines": true,
      "skipComments": true
    }],
    "max-lines-per-function": ["error", {
      "max": 50,
      "skipBlankLines": true,
      "skipComments": true
    }]
  }
}
```

#### PMD 配置（后端）
```xml
<rule ref="category/java/design.xml/ExcessiveClassLength">
    <properties>
        <property name="minimum" value="500"/>
    </properties>
</rule>
<rule ref="category/java/design.xml/ExcessiveMethodLength">
    <properties>
        <property name="minimum" value="80"/>
    </properties>
</rule>
```

### 代码审查清单
- [ ] 检查文件行数是否超过限制
- [ ] 检查函数行数是否超过限制
- [ ] 检查类行数是否超过限制
- [ ] 确认是否有适当的组件/类拆分
- [ ] 验证拆分后的代码是否符合单一职责原则

### 代码质量监控
- 使用 SonarQube 进行代码质量分析
- 每周生成代码质量报告
- 对违反规范的代码进行及时整改

## 8. 依赖管理规范

### 依赖变更控制
- **严禁**未经评审擅自变更任何依赖版本
- **严禁**未经评审引入新的依赖组件
- 所有依赖版本必须**显式**指定，禁止使用动态版本（如 `LATEST`、`*`）
- 禁止引入重复功能的依赖包

### 依赖引入评审流程
1. **提出申请**
   - 填写依赖引入申请表，包含：
     - 依赖名称和版本
     - 引入原因
     - 功能说明
     - 替代方案分析
     - 潜在风险评估

2. **技术评审**
   - 评估依赖的必要性
   - 检查是否存在功能重复
   - 评估依赖的质量：
     - 社区活跃度
     - 版本更新频率
     - 已知漏洞
     - 许可证兼容性
   - 评估对项目的影响：
     - 构建时间
     - 包大小
     - 性能影响
     - 兼容性问题

3. **审批流程**
   - 技术负责人审批
   - 架构师审批（如需）
   - 安全团队审批（如需）

### 现有依赖清单
#### 后端核心依赖
```xml
<!-- 以下依赖版本已经过评审，禁止随意变更 -->
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <version>2.7.x</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
        <version>2.7.x</version>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.x</version>
    </dependency>
    <!-- 其他核心依赖... -->
</dependencies>
```

#### 前端核心依赖
```json
{
  "dependencies": {
    "vue": "^3.3.0",
    "element-plus": "^2.4.0",
    "axios": "^1.6.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0"
  }
}
```

### 依赖版本更新策略
1. **定期评估**
   - 每月评估一次依赖更新需求
   - 重点关注安全补丁和重要功能更新

2. **更新原则**
   - 安全漏洞修复：必须更新
   - 重大bug修复：评估后更新
   - 功能性更新：非必要不更新
   - 大版本升级：需要完整的评估和测试方案

3. **更新流程**
   - 在测试环境进行充分测试
   - 进行性能对比测试
   - 进行兼容性测试
   - 编写升级文档
   - 制定回滚方案

### 依赖引入申请表模板
```markdown
## 依赖引入申请

### 基本信息
- 依赖名称：
- 版本号：
- 申请人：
- 申请日期：

### 引入原因
[详细说明为什么需要引入该依赖]

### 功能说明
[该依赖提供的主要功能]

### 替代方案分析
[列举可能的替代方案及对比分析]

### 风险评估
- 安全风险：
- 性能影响：
- 维护成本：
- 许可证风险：

### 技术评审意见
- 评审人：
- 评审结果：
- 评审意见：

### 最终审批
- 审批人：
- 审批结果：
- 审批意见：

```

## 9. 前后端协作开发流程

### 开发流程概述
1. **需求分析**
   - 产品需求评审
   - 技术方案评审
   - 确定开发周期

2. **开发计划制定**
   - 功能模块拆分
   - 前后端任务分配
   - 制定里程碑节点

3. **接口设计**
   - 接口文档评审
   - 确定数据结构
   - Mock 数据准备

4. **并行开发**
   - 后端：
     - 编写接口文档
     - 提供 Mock 接口
     - 实现真实接口
     - 编写接口测试用例
   - 前端：
     - 基于 Mock 数据开发界面
     - 实现页面交互
     - 编写单元测试
     - 进行页面自测

5. **联调阶段**
   - 前端对接真实接口
   - 处理异常情况
   - 优化交互体验
   - 修复问题

6. **测试阶段**
   - 提交测试
   - 修复 Bug
   - 验证修复结果

### 沟通机制
1. **日常沟通**
   - 使用企业即时通讯工具
   - 建立项目群和技术群
   - 及时反馈问题和进度

2. **例会机制**
   - 晨会：同步昨日进度，今日计划
   - 周会：总结本周，规划下周
   - 评审会：需求评审、技术评审

3. **文档同步**
   - 接口文档实时更新
   - 开发进度表每日更新
   - 问题日志及时记录

### 开发注意事项
1. **前端开发**
   - 严格按照接口文档开发
   - 做好请求错误处理
   - 实现骨架屏等加载态
   - 添加必要的数据验证

2. **后端开发**
   - 遵循接口文档规范
   - 做好参数校验
   - 规范错误码和提示信息
   - 注意性能优化

3. **协作配合**
   - 发现问题及时沟通
   - 接口变更及时通知
   - 保持文档更新
   - 遵守开发规范

## 10. 数据库配置模块

### 后端开发

#### 数据库配置实体

数据库配置实体（`DatabaseConfig`）包含以下字段：
- `id`: UUID，主键
- `projectId`: UUID，关联的项目ID
- `name`: 配置名称
- `description`: 配置描述
- `type`: 数据库类型（MYSQL/POSTGRESQL）
- `host`: 主机地址
- `port`: 端口号
- `databaseName`: 数据库名
- `username`: 用户名
- `password`: 密码
- `status`: 状态（ACTIVE/INACTIVE/DELETED）
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

#### 数据库配置服务

`DatabaseConfigService` 提供以下功能：
- 创建数据库配置
- 获取数据库配置
- 获取项目的所有数据库配置
- 更新数据库配置
- 删除数据库配置
- 测试数据库连接

#### 数据库配置控制器

`DatabaseConfigController` 提供 RESTful API，支持：
- GET /api/projects/{projectId}/database-configs
- GET /api/projects/{projectId}/database-configs/{id}
- POST /api/projects/{projectId}/database-configs
- PUT /api/projects/{projectId}/database-configs/{id}
- DELETE /api/projects/{projectId}/database-configs/{id}
- POST /api/projects/{projectId}/database-configs/test-connection

### 前端开发

#### 组件结构

```
components/database/
├── DatabaseConfigList.vue    # 数据库配置列表组件
└── DatabaseConfigForm.vue    # 数据库配置表单组件
```

#### 类型定义

```typescript
// types/database.ts
export interface DatabaseConfig {
  id?: string
  projectId: string
  name: string
  description?: string
  type: 'MYSQL' | 'POSTGRESQL'
  host: string
  port: number
  databaseName: string
  username: string
  password: string
  status?: 'ACTIVE' | 'INACTIVE' | 'DELETED'
  createdAt?: string
  updatedAt?: string
}

export interface DatabaseConfigForm extends Omit<DatabaseConfig, 'id' | 'status' | 'createdAt' | 'updatedAt'> {
  id?: string
}

export interface DatabaseConfigListItem extends Pick<DatabaseConfig, 'id' | 'name' | 'type' | 'host' | 'databaseName' | 'status'> {
  projectId: string
}
```

#### API 接口

```typescript
// api/database.ts
export function getDatabaseConfigs(projectId: string): Promise<DatabaseConfig[]>
export function getDatabaseConfig(projectId: string, configId: string): Promise<DatabaseConfig>
export function createDatabaseConfig(projectId: string, data: DatabaseConfig): Promise<DatabaseConfig>
export function updateDatabaseConfig(projectId: string, configId: string, data: DatabaseConfig): Promise<DatabaseConfig>
export function deleteDatabaseConfig(projectId: string, configId: string): Promise<void>
export function testDatabaseConnection(projectId: string, data: DatabaseConfig): Promise<boolean>
```

### 测试

#### 后端测试

使用 JUnit 和 Mockito 进行单元测试：
- `DatabaseConfigServiceTest`: 测试服务层逻辑
- `DatabaseConfigControllerTest`: 测试控制器层接口

#### 前端测试

使用 Jest 和 Vue Test Utils 进行单元测试：
- `DatabaseConfigList.spec.ts`: 测试列表组件
- `DatabaseConfigForm.spec.ts`: 测试表单组件

### 最佳实践

1. 数据库配置
   - 密码应该加密存储
   - 敏感信息在传输时应该使用 HTTPS
   - 定期清理未使用的配置

2. 错误处理
   - 前端应该显示友好的错误信息
   - 后端应该记录详细的错误日志
   - 连接测试应该设置超时时间

3. 性能优化
   - 缓存频繁访问的配置
   - 分页加载大量配置
   - 异步处理耗时操作
