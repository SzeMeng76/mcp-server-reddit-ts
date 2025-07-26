# 🔴 Reddit MCP 服务器

**中文版** | **[English](./README.md)**

> 通过 Reddit API 访问 Reddit 数据的综合 MCP 服务器

## 🎯 项目概述

一个模型上下文协议（MCP）服务器，提供对 Reddit 数据的无缝访问，包括子版块、帖子、评论和搜索功能。使用 TypeScript 和官方 Reddit API 构建，实现可靠快速的数据检索。

## ✨ 功能特性

- 🏠 **子版块信息**: 获取任何子版块的详细信息
- 🔍 **帖子搜索**: 在子版块内搜索帖子，支持多种排序选项
- 📝 **帖子详情**: 检索完整的帖子信息，包括内容和元数据
- 💬 **评论功能**: 获取帖子评论，支持不同排序方法
- 🌐 **子版块发现**: 搜索和发现新的子版块
- 🔑 **OAuth 认证**: 使用 Reddit API 凭据的安全访问
- 🔄 **自动令牌刷新**: 自动访问令牌管理
- 🎨 **丰富格式**: 格式良好的响应和全面的数据
- ⚡ **高性能**: 高效的 API 调用和适当的错误处理

## 📦 安装

```bash
npm install reddit-mcp
```

或直接使用 npx：

```bash
npx reddit-mcp
```

## 🔧 前置要求

使用此 MCP 服务器之前，您需要获取 Reddit API 凭据：

1. **创建 Reddit 应用**：
   - 访问 [Reddit 应用偏好设置](https://www.reddit.com/prefs/apps)
   - 点击"创建应用"或"创建另一个应用"
   - 选择"script"作为应用类型
   - 记录您的 `client_id` 和 `client_secret`

2. **设置环境变量**：
   ```bash
   export REDDIT_CLIENT_ID="your_client_id_here"
   export REDDIT_CLIENT_SECRET="your_client_secret_here"
   ```

   或创建 `.env` 文件：
   ```env
   REDDIT_CLIENT_ID=your_client_id_here
   REDDIT_CLIENT_SECRET=your_client_secret_here
   ```

## 🔧 配置

### Claude Desktop

```json
{
  "mcpServers": {
    "reddit": {
      "command": "npx",
      "args": ["reddit-mcp"],
      "env": {
        "REDDIT_CLIENT_ID": "your_client_id_here",
        "REDDIT_CLIENT_SECRET": "your_client_secret_here"
      }
    }
  }
}
```

### Cursor IDE

```json
{
  "mcpServers": {
    "reddit": {
      "command": "npx",
      "args": ["reddit-mcp"],
      "env": {
        "REDDIT_CLIENT_ID": "your_client_id_here",
        "REDDIT_CLIENT_SECRET": "your_client_secret_here"
      }
    }
  }
}
```

### VS Code 与 GitHub Copilot

```json
{
  "mcp.servers": {
    "reddit": {
      "command": "npx",
      "args": ["reddit-mcp"],
      "transport": "stdio",
      "env": {
        "REDDIT_CLIENT_ID": "your_client_id_here",
        "REDDIT_CLIENT_SECRET": "your_client_secret_here"
      }
    }
  }
}
```

## 🛠️ 可用工具

### `get_subreddit`
获取特定子版块的详细信息。

**参数：**
- `name`（必需）: 要检索的子版块名称（不包含 'r/' 前缀）

**使用示例：**
```
"获取 programming 子版块的信息"
"显示 MachineLearning 子版块的详情"
```

**返回内容：**
- 子版块标题和描述
- 订阅者数量
- 创建日期
- NSFW 状态
- URL

### `search_posts`
在子版块内搜索帖子或获取热门帖子。

**参数：**
- `subreddit`（必需）: 要搜索的子版块名称
- `query`（可选）: 搜索查询字符串（如果为空，返回热门帖子）
- `sort`（可选）: 排序方法 - "relevance"、"hot"、"new"、"top"、"comments"（默认: "hot"）
- `time`（可选）: 时间范围 - "all"、"hour"、"day"、"week"、"month"、"year"（默认: "all"）
- `limit`（可选）: 返回的最大帖子数量（1-100，默认: 10）

**使用示例：**
```
"在 r/MachineLearning 中搜索关于'人工智能'的帖子"
"获取 r/programming 的前 20 个热门帖子"
"在 r/webdev 中查找过去一周关于'React'的新帖子"
```

**返回内容：**
- 帖子标题和 URL
- 作者信息
- 评分和评论数
- 帖子 ID（用于进一步查询）

### `get_submission`
获取特定帖子的详细信息。

**参数：**
- `id`（必需）: 帖子 ID（带或不带 't3_' 前缀）

**使用示例：**
```
"获取帖子 ID abc123 的详情"
"显示帖子 t3_xyz789 的完整内容"
```

**返回内容：**
- 完整的帖子标题和内容
- 作者和子版块信息
- 评分和评论统计
- 创建时间
- 帖子类型（文本或链接）

### `get_comments_by_submission`
获取特定帖子的评论。

**参数：**
- `submission_id`（必需）: 要获取评论的帖子 ID
- `sort`（可选）: 评论排序方法 - "confidence"、"top"、"new"、"controversial"、"old"、"random"、"qa"、"live"（默认: "confidence"）
- `limit`（可选）: 返回的最大评论数量（1-100，默认: 10）

**使用示例：**
```
"获取帖子 abc123 的前 15 个评论"
"显示帖子 xyz789 的最新评论"
```

**返回内容：**
- 评论内容和作者
- 评论分数
- 创建时间戳
- 评论 ID

### `get_comment`
获取特定评论的详细信息。

**参数：**
- `id`（必需）: 评论 ID（带或不带 't1_' 前缀）

**使用示例：**
```
"获取评论 ID def456 的详情"
"显示评论 t1_ghi789"
```

**返回内容：**
- 评论内容和作者
- 分数和创建时间
- 关联的子版块和帖子
- 评论 ID

### `search_subreddits`
按名称或描述搜索子版块。

**参数：**
- `query`（必需）: 子版块名称或描述的搜索查询
- `limit`（可选）: 返回的最大子版块数量（1-100，默认: 10）

**使用示例：**
```
"搜索关于烹饪的子版块"
"查找编程相关的子版块"
```

**返回内容：**
- 子版块名称和描述
- 订阅者数量
- NSFW 状态
- URL

## 🎮 使用示例

### 内容发现
```
"查找 r/technology 本周最受欢迎的帖子"
"在 r/MachineLearning 中搜索关于'GPT-4'的讨论"
```

### 研究和分析
```
"获取 r/datascience 的信息并显示前 10 个帖子"
"查找与'区块链'相关的子版块并显示其订阅者数量"
```

### 评论分析
```
"获取帖子 abc123 的顶级评论并分析情感"
"显示帖子 xyz789 的争议性评论"
```

### 趋势监控
```
"今天 r/programming 中的热门话题是什么？"
"在相关子版块中搜索关于'ChatGPT'的帖子"
```

## 🏗️ 开发

### 本地设置

```bash
# 克隆仓库
git clone https://github.com/SzeMeng76/mcp-server-reddit-ts.git
cd mcp-server-reddit-ts

# 安装依赖
npm install

# 设置环境变量
cp .env.example .env
# 使用您的 Reddit API 凭据编辑 .env

# 启动服务器
npm start
```

### 项目结构

```
mcp-server-reddit-ts/
├── index.js              # 主 MCP 服务器实现
├── package.json          # 依赖和脚本
├── .env.example          # 环境变量模板
└── README.md            # 文档
```

### 核心依赖

- **@modelcontextprotocol/sdk**: 官方 MCP 服务器框架
- **node-fetch**: 用于 Reddit API 调用的 HTTP 客户端
- **dotenv**: 环境变量管理
- **zod**: 运行时类型验证和模式定义

## 🔧 技术细节

### 认证流程
- 使用 OAuth 2.0 客户端凭据流
- 令牌过期时自动刷新
- 通过环境变量进行安全凭据处理

### API 速率限制
- 遵守 Reddit API 速率限制
- 实现适当的 User-Agent 头
- 优雅处理 HTTP 错误

### 数据处理
- 全面的数据格式化以提高可读性
- 正确处理 Reddit 的嵌套评论结构
- 清洁的 ID 处理（自动删除前缀）

### 错误处理
- 常见问题的详细错误消息
- API 失败的优雅降级
- 输入参数的适当验证

## ⚠️ 重要提示

### Reddit API 指南
- 遵循 Reddit 的 [API 服务条款](https://www.redditinc.com/policies/developer-terms)
- 尊重速率限制（客户端凭据每分钟 60 次请求）
- 使用描述性的 User-Agent 字符串
- 不要发出过多请求

### 数据隐私
- 此服务器仅访问公共 Reddit 数据
- 无用户认证或私人数据访问
- 尊重 Reddit 的隐私设置和已删除内容

### 内容指南
- 访问某些子版块时注意 NSFW 内容
- 尊重社区规则和指南
- 负责任地使用数据进行研究和分析

## 🚀 常见用例

### 市场研究
- **趋势分析**: 监控关于产品或主题的讨论
- **情感分析**: 分析对品牌或事件的公众意见
- **社区洞察**: 了解受众偏好和行为

### 内容策略
- **主题发现**: 在相关社区中查找热门话题
- **参与度分析**: 研究哪些内容表现良好
- **社区研究**: 识别您所在领域的活跃社区

### 学术研究
- **社交媒体研究**: 分析在线社区动态
- **公众意见研究**: 研究态度和观点
- **内容分析**: 检查沟通模式

### 开发和测试
- **API 集成**: 在应用中测试 Reddit 数据集成
- **机器人开发**: 原型化 Reddit 机器人和自动化工具
- **数据分析**: 处理 Reddit 数据以获得洞察

## 🤝 贡献

1. Fork 仓库
2. 创建功能分支：`git checkout -b feature-name`
3. 进行更改并添加适当的错误处理
4. 使用各种子版块和内容类型进行测试
5. 确保环境变量得到适当记录
6. 提交带有清晰描述的 pull request

### 开发指南

- 遵循 JavaScript/Node.js 最佳实践
- 为新功能添加适当的错误处理
- 使用热门和小众子版块进行测试
- 记录任何新参数或返回格式
- 尊重 Reddit API 指南和速率限制

## 📄 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## ⚖️ 法律和伦理

- **Reddit API 合规**: 严格遵循 Reddit 的开发者条款
- **仅公共数据**: 仅访问公开可用的 Reddit 内容
- **速率限制**: 尊重 API 限制以避免服务中断
- **内容责任**: 用户必须确保适当使用访问的数据
- **隐私尊重**: 不访问私人消息或受限内容

## 🙏 致谢

- **Reddit**: 提供全面的 Reddit API
- **MCP 社区**: 标准化协议
- **Node-fetch 维护者**: 可靠的 HTTP 客户端功能
- **贡献者**: 所有帮助改进这个项目的人

---

*为 Reddit 数据分析、内容研究和社区洞察而构建* 🔴📊
