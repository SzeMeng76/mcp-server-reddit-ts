import dotenv from 'dotenv';
import { version } from '../package.json';

// 加载环境变量
dotenv.config();

export const config = {
  version,
  reddit: {
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    userAgent: `reddit-mcp:v${version} (by /u/your_username)`,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  }
};

// 验证必要的配置
if (!config.reddit.clientId || !config.reddit.clientSecret) {
  throw new Error('Missing Reddit API credentials. Please set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET environment variables.');
}
