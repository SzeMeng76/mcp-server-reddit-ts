import { z } from 'zod';
import { redditApiRequest } from '../api/requests.js';
import { endpoints } from '../api/endpoints.js';
import { formatSubredditSearchResults } from '../formatters/subreddit.js';
import { handleApiError } from '../utils/error-handler.js';

export function registerSearchTools(server) {
  // 搜索 Subreddit（如果 subreddit.js 已经包含了此工具，可以移除这里的重复定义）
  server.tool(
    'search_subreddits',
    'Search subreddits by name or description',
    {
      query: z.string().describe('The search query'),
      limit: z.number().min(1).max(100).optional().describe('Maximum number of subreddits to return')
    },
    async ({ query, limit = 10 }) => {
      try {
        const params = {
          q: query,
          limit: limit.toString()
        };
        
        const results = await redditApiRequest(endpoints.subreddit.search, params);
        
        return {
          content: [
            {
              type: 'text',
              text: formatSubredditSearchResults(results.data.children)
            }
          ]
        };
      } catch (error) {
        return handleApiError('Failed to search subreddits', error);
      }
    }
  );
  
  // 可以在这里添加更多搜索相关的工具
  // 例如：搜索用户、搜索跨多个subreddit的内容等
}
