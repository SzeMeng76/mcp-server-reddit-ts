import { z } from 'zod';
import { redditApiRequest } from '../api/requests.js';
import { endpoints } from '../api/endpoints.js';
import { formatCommentData, formatCommentsData } from '../formatters/comment.js';
import { handleApiError } from '../utils/error-handler.js';

export function registerCommentTools(server) {
  // 获取单个评论
  server.tool(
    'get_comment',
    'Access a comment',
    {
      id: z.string().describe('The ID of the comment to retrieve'),
    },
    async ({ id }) => {
      try {
        // 清理ID（如果有前缀）
        const cleanId = id.replace('t1_', '');
        const comment = await redditApiRequest(endpoints.comment.get, {id: `t1_${cleanId}`});
        
        if (!comment.data.children || comment.data.children.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `Comment not found with ID: ${id}`
              }
            ]
          };
        }
        
        return {
          content: [
            {
              type: 'text',
              text: formatCommentData(comment.data.children[0].data)
            }
          ]
        };
      } catch (error) {
        return handleApiError('Failed to retrieve comment', error);
      }
    }
  );
  
  // 获取帖子的评论
  server.tool(
    'get_comments_by_submission',
    'Access comments of a submission',
    {
      submission_id: z.string().describe('The ID of the submission to retrieve comments from'),
      sort: z.enum(['confidence', 'top', 'new', 'controversial', 'old', 'random', 'qa', 'live']).optional().describe('How to sort the comments'),
      limit: z.number().min(1).max(100).optional().describe('Maximum number of comments to return')
    },
    async ({ submission_id, sort = 'confidence', limit = 10 }) => {
      try {
        // 清理ID（如果有前缀）
        const cleanId = submission_id.replace('t3_', '');
        
        const params = {
          sort,
          limit: limit.toString()
        };
        
        const data = await redditApiRequest(endpoints.post.get(cleanId), params);
        const comments = data[1].data.children.filter(child => child.kind === 't1');
        
        return {
          content: [
            {
              type: 'text',
              text: formatCommentsData(comments)
            }
          ]
        };
      } catch (error) {
        return handleApiError('Failed to retrieve comments', error);
      }
    }
  );
}
