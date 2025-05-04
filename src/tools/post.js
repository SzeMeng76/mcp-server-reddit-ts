import { z } from 'zod';
import { redditApiRequest } from '../api/requests.js';
import { endpoints } from '../api/endpoints.js';
import { formatSubmissionData, formatSearchResults } from '../formatters/post.js';
import { handleApiError } from '../utils/error-handler.js';

export function registerPostTools(server) {
  // 获取帖子详情
  server.tool(
    'get_submission',
    'Access a submission',
    {
      id: z.string().describe('The ID of the submission to retrieve'),
    },
    async ({ id }) => {
      try {
        // 清理ID（如果有前缀）
        const cleanId = id.replace('t3_', '');
        const submission = await redditApiRequest(endpoints.post.get(cleanId), {limit: '1'});
        
        return {
          content: [
            {
              type: 'text',
              text: formatSubmissionData(submission[0].data.children[0].data)
            }
          ]
        };
      } catch (error) {
        return handleApiError('Failed to retrieve submission', error);
      }
    }
  );
  
  // 搜索帖子
  server.tool(
    'search_posts',
    'Search posts in a subreddit',
    {
      subreddit: z.string().describe('The name of the subreddit to search in'),
      query: z.string().describe('The search query'),
      sort: z.enum(['relevance', 'hot', 'new', 'top', 'comments']).optional().describe('How to sort the results'),
      time: z.enum(['all', 'hour', 'day', 'week', 'month', 'year']).optional().describe('The time period to search within'),
      limit: z.number().min(1).max(100).optional().describe('Maximum number of posts to return')
    },
    async ({ subreddit, query, sort = 'relevance', time = 'all', limit = 10 }) => {
      try {
        const params = {
          q: query,
          sort,
          t: time,
          limit: limit.toString(),
          restrict_sr: 'true'
        };
        
        const results = await redditApiRequest(endpoints.post.search(subreddit), params);
        
        return {
          content: [
            {
              type: 'text',
              text: formatSearchResults(results.data.children)
            }
          ]
        };
      } catch (error) {
        return handleApiError('Failed to search posts', error);
      }
    }
  );
}
