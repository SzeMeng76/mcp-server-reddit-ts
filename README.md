# Reddit MCP 服务器

一个基于[模型上下文协议(MCP)](https://modelcontextprotocol.io)的Reddit服务器，提供浏览、搜索和阅读Reddit内容的功能。这个实现使用JavaScript/Node.js编写，可以通过npx直接运行。

## 功能

- 浏览subreddits、帖子和评论
- 搜索Reddit内容
- 无需Reddit账户即可进行只读访问
- 使用Zod进行强大的输入验证

## 前提条件

在开始之前，请确保您具备以下条件：

- Node.js 18或更高版本
- Reddit API的客户端ID和密钥

### 创建Reddit API应用

1. 访问[Reddit的应用偏好设置](https://www.reddit.com/prefs/apps)
2. 点击底部的"Create App"或"Create Another App"
3. 填写表单：
   - 名称：选择任意名称（例如，"MCP Client"）
   - 应用类型：选择"script"
   - 描述：可选
   - 关于URL：可选
   - 重定向URI：使用`http://localhost:8080`
4. 点击"创建应用"
5. 记下您的`client_id`（应用名称下的字符串）和`client_secret`

## 使用方法

您可以通过npx直接使用此包，无需全局安装：

```bash
# 设置环境变量
export REDDIT_CLIENT_ID=your_client_id
export REDDIT_CLIENT_SECRET=your_client_secret

# 运行MCP服务器
npx reddit-mcp
```

或者，您可以在当前目录中创建一个`.env`文件：

```
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
```

然后运行：

```bash
npx reddit-mcp
```

## 与Claude Desktop一起使用

要在Claude Desktop中使用此服务器：

1. 按照[这里](https://modelcontextprotocol.io/quickstart/user)的说明打开您的Claude Desktop配置文件。

2. 将以下内容添加到文件中：

```json
"mcpServers": {
  "reddit": {
    "command": "npx",
    "args": ["-y", "reddit-mcp"],
    "env": {
      "REDDIT_CLIENT_ID": "your_client_id",
      "REDDIT_CLIENT_SECRET": "your_client_secret"
    }
  }
}
```

3. 重启Claude Desktop。

## 可用工具

服务器提供以下工具：

| 名称 | 描述 |
|------|-------------|
| get_comment | 获取评论 |
| get_comments_by_submission | 获取帖子的评论 |
| get_submission | 获取帖子 |
| get_subreddit | 按名称获取subreddit |
| search_posts | 在subreddit中搜索帖子 |
| search_subreddits | 按名称或描述搜索subreddits |

## 许可证

此包使用MIT许可证。

## 开发

如果您想修改或扩展此MCP服务器：

1. 克隆仓库
2. 安装依赖：`npm install`
3. 进行更改
4. 本地测试：`npm start`
5. 发布到npm（如果适用）
