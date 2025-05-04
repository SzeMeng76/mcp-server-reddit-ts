import { z } from 'zod';
import { redditApiRequest } from '../api/requests.js';
import { endpoints } from '../api/endpoints.js';
import { formatSubredditData, formatSubredditSearchResults } from '../formatters/subreddit.js';
import { handleApiError } from '../utils/error-handler.js';

export function registerSubredditTools(server) {
  // 获取 Subreddit 信息
  server.tool(
    'get_subreddit',
    'Access a subreddit by name',
    {
      name: z.string().describe('The name of the subreddit to retrieve'),
    },
    async ({ name }) => {
      try {
        const subreddit = await redditApiRequest(endpoints.subreddit.about(name));
        
        return {
          content: [
            {
              type: 'text',
              text: formatSubredditData(subreddit.data)
            }
          ]
        };
      } catch (error) {
        return handleApiError('Failed to retrieve subreddit', error);
      }
    }
  );
  
  // 搜索 Subreddit
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
}
