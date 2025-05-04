# MCP Server Reddit (TypeScript)

一个 Model Context Protocol (MCP) 服务器，提供 Reddit 内容获取功能，包括首页热门帖子、子版块信息和热门帖子、帖子详情及评论等功能。这是使用 TypeScript 实现的版本。

## 功能特性

- 获取 Reddit 首页热门帖子
- 获取特定子版块信息
- 获取特定子版块的热门帖子
- 获取特定子版块的最新帖子
- 获取特定子版块的最佳帖子（按时间段过滤）
- 获取特定子版块的新兴帖子
- 获取特定帖子的详细内容和评论
- 获取特定帖子的评论

## 安装与使用

你可以通过两种方式使用该包：

### 1. 通过 npx 直接使用

```bash
npx mcp-server-reddit-ts
```

### 2. 全局安装

```bash
npm install -g mcp-server-reddit-ts
mcp-server-reddit-ts
```

## 在 Claude Desktop 中使用

将以下内容添加到你的 Claude Desktop 配置文件中：

```json
{
  "mcpServers": {
    "reddit": {
      "command": "npx",
      "args": ["mcp-server-reddit-ts"]
    }
  }
}
```

## 在 Zed 中使用

将以下内容添加到你的 Zed settings.json 文件中：

```json
"context_servers": {
  "mcp-server-reddit": {
    "command": "npx",
    "args": ["mcp-server-reddit-ts"]
  }
}
```

## 可用工具

该服务器提供以下工具：

### get_frontpage_posts

获取 Reddit 首页热门帖子。

示例提示：
> "获取 Reddit 首页上的热门帖子"

### get_subreddit_info

获取子版块信息。

示例提示：
> "请告诉我关于 r/Python 的信息"

### get_subreddit_hot_posts

获取子版块的热门帖子。

示例提示：
> "获取 r/Programming 子版块中的热门帖子"

### get_subreddit_new_posts

获取子版块的最新帖子。

示例提示：
> "显示 r/news 中最新的帖子"

### get_subreddit_top_posts

获取子版块的最佳帖子。

示例提示：
> "获取 r/AskReddit 中所有时间最佳的帖子"

### get_subreddit_rising_posts

获取子版块的新兴帖子。

示例提示：
> "r/technology 中现在有哪些正在上升的帖子？"

### get_post_content

获取特定帖子的详细内容和评论。

示例提示：
> "获取这个 Reddit 帖子的完整内容和评论：[帖子URL]"

### get_post_comments

获取帖子的评论。

示例提示：
> "总结一下这个 Reddit 帖子的评论：[帖子URL]"

## 开发

### 前提条件

- Node.js 18+
- npm 或 yarn

### 设置

1. 克隆仓库
2. 安装依赖：
   ```bash
   npm install
   ```
3. 构建项目：
   ```bash
   npm run build
   ```
4. 运行服务器：
   ```bash
   npm start
   ```

### 使用 MCP Inspector 进行测试

用于调试和测试你的服务器：

```bash
npm run inspector
```

## 许可证

MIT

## 致谢

本服务器使用 Reddit 公共 API 获取数据。
