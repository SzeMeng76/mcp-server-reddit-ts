import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { config } from './config.js';
import { registerSubredditTools } from './tools/subreddit.js';
import { registerPostTools } from './tools/post.js';
import { registerCommentTools } from './tools/comment.js';
import { registerSearchTools } from './tools/search.js';
import { logger } from './utils/logger.js';

// 创建 MCP 服务器
const server = new McpServer({
  name: 'reddit-mcp',
  version: config.version,
});

// 注册所有工具
export function registerTools() {
  registerSubredditTools(server);
  registerPostTools(server);
  registerCommentTools(server);
  registerSearchTools(server);
  
  logger.info('All tools registered');
  return server;
}

// 启动服务器
export async function start() {
  try {
    // 注册所有工具
    const server = registerTools();
    
    // 连接传输层
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    logger.info('Reddit MCP Server running on stdio');
  } catch (error) {
    logger.error('Failed to start server:', error);
    throw error;
  }
}
