#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import fetch from 'node-fetch';

// 常量定义
const REDDIT_BASE_URL = 'https://www.reddit.com';
const REDDIT_API_BASE = 'https://api.reddit.com';
const USER_AGENT = 'mcp-server-reddit/1.0.0';

// Reddit 相关接口定义
interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  selftext?: string;
  url: string;
  permalink: string;
  created_utc: number;
  score: number;
  ups: number;
  downs: number;
  num_comments: number;
  is_self: boolean;
  is_original_content?: boolean;
  stickied: boolean;
}

interface RedditComment {
  id: string;
  author: string;
  body: string;
  score: number;
  permalink: string;
  created_utc: number;
  replies?: {
    data?: {
      children?: Array<{ kind: string; data: RedditComment }>;
    };
  };
}

interface RedditSubredditInfo {
  id: string;
  display_name: string;
  title: string;
  public_description: string;
  subscribers: number;
  created_utc: number;
  url: string;
  over18: boolean;
}

/**
 * 创建 MCP 服务器
 */
const server = new McpServer({
  name: 'reddit',
  version: '1.0.0',
  description: 'MCP server for accessing Reddit content'
});

/**
 * 修改makeRedditApiRequest函数，添加更好的错误日志
 */
async function makeRedditApiRequest<T>(path: string, params: Record<string, string> = {}): Promise<T | null> {
  try {
    // 添加.json扩展名（如果没有）
    const jsonPath = path.endsWith('.json') ? path : `${path}.json`;
    
    // 构建 URL 参数
    const queryParams = new URLSearchParams(params).toString();
    const url = `${REDDIT_API_BASE}${jsonPath}${queryParams ? `?${queryParams}` : ''}`;
    
    console.log(`[DEBUG] 请求URL: ${url}`);
    
    // 发起请求
    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT
      }
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '无法获取错误详情');
      console.error(`[ERROR] API错误 (${response.status}): ${errorText}`);
      throw new Error(`HTTP错误: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('[ERROR] 无法发起Reddit API请求:', error);
    return null;
  }
}

/**
 * 检查所有工具函数确保参数正确声明
 */
// 例如，修改get_frontpage_posts工具的实现：
server.tool(
  'get_frontpage_posts',
  'Get hot posts from Reddit frontpage',
  {
    limit: z.number().min(1).max(100).default(10).describe('Number of posts to return (default: 10, range: 1-100)')
  },
  async ({ limit }) => {  // 确保这里正确解构了limit参数
    try {
      // 修改路径添加.json后缀
      const response = await makeRedditApiRequest<any>('/hot.json', { limit: limit.toString() });

/**
 * 格式化 Reddit 帖子
 */
function formatRedditPost(post: any): RedditPost {
  const postData = post.data || post;
  return {
    id: postData.id,
    title: postData.title,
    author: postData.author,
    subreddit: postData.subreddit,
    selftext: postData.selftext,
    url: postData.url,
    permalink: postData.permalink,
    created_utc: postData.created_utc,
    score: postData.score,
    ups: postData.ups,
    downs: postData.downs,
    num_comments: postData.num_comments,
    is_self: postData.is_self,
    is_original_content: postData.is_original_content,
    stickied: postData.stickied
  };
}

/**
 * 格式化 Reddit 帖子列表为文本
 */
function formatPostsListToText(posts: RedditPost[], source: string = ''): string {
  let result = source ? `${source} posts:\n\n` : 'Posts:\n\n';
  
  posts.forEach((post, index) => {
    const date = new Date(post.created_utc * 1000).toISOString().split('T')[0];
    result += `${index + 1}. ${post.title}\n`;
    result += `   Posted by: u/${post.author} in r/${post.subreddit} on ${date}\n`;
    result += `   Score: ${post.score} | Comments: ${post.num_comments}\n`;
    result += `   URL: ${REDDIT_BASE_URL}${post.permalink}\n\n`;
  });

  return result;
}

/**
 * 提取 Reddit 帖子 ID 从 URL
 */
function extractPostIdFromUrl(url: string): string | null {
  // Reddit URLs 通常格式为: https://www.reddit.com/r/subreddit/comments/POST_ID/title/
  const regex = /reddit\.com\/r\/[^\/]+\/comments\/([^\/]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * 工具: 获取 Reddit 首页热门帖子
 */
server.tool(
  'get_frontpage_posts',
  'Get hot posts from Reddit frontpage',
  {
    limit: z.number().min(1).max(100).default(10).describe('Number of posts to return (default: 10, range: 1-100)')
  },
  async ({ limit }) => {
    try {
      const response = await makeRedditApiRequest<any>('/hot', { limit: limit.toString() });
      
      if (!response || !response.data || !response.data.children) {
        return {
          content: [
            {
              type: 'text',
              text: 'Failed to retrieve Reddit frontpage posts.'
            }
          ]
        };
      }

      const posts = response.data.children.map((child: any) => formatRedditPost(child));
      const formattedText = formatPostsListToText(posts, 'Reddit frontpage hot');

      return {
        content: [
          {
            type: 'text',
            text: formattedText
          }
        ]
      };
    } catch (error) {
      console.error('[ERROR] Failed to get frontpage posts:', error);
      return {
        content: [
          {
            type: 'text',
            text: `An error occurred while fetching frontpage posts: ${error}`
          }
        ]
      };
    }
  }
);

/**
 * 工具: 获取子版块信息
 */
server.tool(
  'get_subreddit_info',
  'Get information about a subreddit',
  {
    subreddit_name: z.string().describe('Name of the subreddit (e.g. "Python", "news")')
  },
  async ({ subreddit_name }) => {
    try {
      const response = await makeRedditApiRequest<any>(`/r/${subreddit_name}/about`);
      
      if (!response || !response.data) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to retrieve information for subreddit: ${subreddit_name}`
            }
          ]
        };
      }

      const subredditInfo: RedditSubredditInfo = {
        id: response.data.id,
        display_name: response.data.display_name,
        title: response.data.title,
        public_description: response.data.public_description,
        subscribers: response.data.subscribers,
        created_utc: response.data.created_utc,
        url: response.data.url,
        over18: response.data.over18
      };

      const creationDate = new Date(subredditInfo.created_utc * 1000).toISOString().split('T')[0];
      
      const formattedText = [
        `# r/${subredditInfo.display_name}`,
        `Title: ${subredditInfo.title}`,
        `Description: ${subredditInfo.public_description}`,
        `Subscribers: ${subredditInfo.subscribers.toLocaleString()}`,
        `Created: ${creationDate}`,
        `NSFW: ${subredditInfo.over18 ? 'Yes' : 'No'}`,
        `URL: ${REDDIT_BASE_URL}${subredditInfo.url}`
      ].join('\n\n');

      return {
        content: [
          {
            type: 'text',
            text: formattedText
          }
        ]
      };
    } catch (error) {
      console.error('[ERROR] Failed to get subreddit info:', error);
      return {
        content: [
          {
            type: 'text',
            text: `An error occurred while fetching information for subreddit ${subreddit_name}: ${error}`
          }
        ]
      };
    }
  }
);

/**
 * 工具: 获取子版块热门帖子
 */
server.tool(
  'get_subreddit_hot_posts',
  'Get hot posts from a specific subreddit',
  {
    subreddit_name: z.string().describe('Name of the subreddit (e.g. "Python", "news")'),
    limit: z.number().min(1).max(100).default(10).describe('Number of posts to return (default: 10, range: 1-100)')
  },
  async ({ subreddit_name, limit }) => {
    try {
      const response = await makeRedditApiRequest<any>(`/r/${subreddit_name}/hot`, { limit: limit.toString() });
      
      if (!response || !response.data || !response.data.children) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to retrieve hot posts for subreddit: ${subreddit_name}`
            }
          ]
        };
      }

      const posts = response.data.children.map((child: any) => formatRedditPost(child));
      const formattedText = formatPostsListToText(posts, `r/${subreddit_name} hot`);

      return {
        content: [
          {
            type: 'text',
            text: formattedText
          }
        ]
      };
    } catch (error) {
      console.error('[ERROR] Failed to get subreddit hot posts:', error);
      return {
        content: [
          {
            type: 'text',
            text: `An error occurred while fetching hot posts for subreddit ${subreddit_name}: ${error}`
          }
        ]
      };
    }
  }
);

/**
 * 工具: 获取子版块最新帖子
 */
server.tool(
  'get_subreddit_new_posts',
  'Get new posts from a specific subreddit',
  {
    subreddit_name: z.string().describe('Name of the subreddit (e.g. "Python", "news")'),
    limit: z.number().min(1).max(100).default(10).describe('Number of posts to return (default: 10, range: 1-100)')
  },
  async ({ subreddit_name, limit }) => {
    try {
      const response = await makeRedditApiRequest<any>(`/r/${subreddit_name}/new`, { limit: limit.toString() });
      
      if (!response || !response.data || !response.data.children) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to retrieve new posts for subreddit: ${subreddit_name}`
            }
          ]
        };
      }

      const posts = response.data.children.map((child: any) => formatRedditPost(child));
      const formattedText = formatPostsListToText(posts, `r/${subreddit_name} new`);

      return {
        content: [
          {
            type: 'text',
            text: formattedText
          }
        ]
      };
    } catch (error) {
      console.error('[ERROR] Failed to get subreddit new posts:', error);
      return {
        content: [
          {
            type: 'text',
            text: `An error occurred while fetching new posts for subreddit ${subreddit_name}: ${error}`
          }
        ]
      };
    }
  }
);

/**
 * 工具: 获取子版块最佳帖子
 */
server.tool(
  'get_subreddit_top_posts',
  'Get top posts from a specific subreddit',
  {
    subreddit_name: z.string().describe('Name of the subreddit (e.g. "Python", "news")'),
    limit: z.number().min(1).max(100).default(10).describe('Number of posts to return (default: 10, range: 1-100)'),
    time: z.enum(['hour', 'day', 'week', 'month', 'year', 'all']).default('all')
      .describe('Time filter for top posts (default: "all")')
  },
  async ({ subreddit_name, limit, time }) => {
    try {
      const response = await makeRedditApiRequest<any>(
        `/r/${subreddit_name}/top`, 
        { 
          limit: limit.toString(),
          t: time
        }
      );
      
      if (!response || !response.data || !response.data.children) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to retrieve top posts for subreddit: ${subreddit_name}`
            }
          ]
        };
      }

      const posts = response.data.children.map((child: any) => formatRedditPost(child));
      const timeLabel = time !== 'all' ? ` (${time})` : '';
      const formattedText = formatPostsListToText(posts, `r/${subreddit_name} top${timeLabel}`);

      return {
        content: [
          {
            type: 'text',
            text: formattedText
          }
        ]
      };
    } catch (error) {
      console.error('[ERROR] Failed to get subreddit top posts:', error);
      return {
        content: [
          {
            type: 'text',
            text: `An error occurred while fetching top posts for subreddit ${subreddit_name}: ${error}`
          }
        ]
      };
    }
  }
);

/**
 * 工具: 获取子版块新兴帖子
 */
server.tool(
  'get_subreddit_rising_posts',
  'Get rising posts from a specific subreddit',
  {
    subreddit_name: z.string().describe('Name of the subreddit (e.g. "Python", "news")'),
    limit: z.number().min(1).max(100).default(10).describe('Number of posts to return (default: 10, range: 1-100)')
  },
  async ({ subreddit_name, limit }) => {
    try {
      const response = await makeRedditApiRequest<any>(`/r/${subreddit_name}/rising`, { limit: limit.toString() });
      
      if (!response || !response.data || !response.data.children) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to retrieve rising posts for subreddit: ${subreddit_name}`
            }
          ]
        };
      }

      const posts = response.data.children.map((child: any) => formatRedditPost(child));
      const formattedText = formatPostsListToText(posts, `r/${subreddit_name} rising`);

      return {
        content: [
          {
            type: 'text',
            text: formattedText
          }
        ]
      };
    } catch (error) {
      console.error('[ERROR] Failed to get subreddit rising posts:', error);
      return {
        content: [
          {
            type: 'text',
            text: `An error occurred while fetching rising posts for subreddit ${subreddit_name}: ${error}`
          }
        ]
      };
    }
  }
);

/**
 * 工具: 获取帖子详情及评论
 */
server.tool(
  'get_post_content',
  'Get detailed content of a specific post',
  {
    post_id: z.string().describe('ID of the post or full Reddit post URL'),
    comment_limit: z.number().min(1).max(100).default(10).describe('Number of top-level comments to return (default: 10, range: 1-100)'),
    comment_depth: z.number().min(1).max(10).default(3).describe('Maximum depth of comment tree (default: 3, range: 1-10)')
  },
  async ({ post_id, comment_limit, comment_depth }) => {
    try {
      // 检查post_id是否为URL
      const extractedId = post_id.includes('reddit.com') 
        ? extractPostIdFromUrl(post_id) 
        : post_id;
        
      if (!extractedId) {
        return {
          content: [
            {
              type: 'text',
              text: 'Invalid post ID or URL format.'
            }
          ]
        };
      }

      // 获取帖子内容和评论
      const response = await makeRedditApiRequest<any>(`/comments/${extractedId}`, { 
        limit: comment_limit.toString(),
        depth: comment_depth.toString() 
      });
      
      if (!response || !Array.isArray(response) || response.length < 2) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to retrieve content for post: ${extractedId}`
            }
          ]
        };
      }

      // 帖子内容
      const postData = response[0].data.children[0].data;
      const post = formatRedditPost(postData);
      const postDate = new Date(post.created_utc * 1000).toLocaleString();

      // 格式化帖子内容
      let formattedText = `# ${post.title}\n\n`;
      formattedText += `Posted by u/${post.author} in r/${post.subreddit} on ${postDate}\n\n`;
      formattedText += `Score: ${post.score} | Comments: ${post.num_comments}\n\n`;
      
      if (post.selftext) {
        formattedText += `---\n\n${post.selftext}\n\n---\n\n`;
      } else if (!post.is_self) {
        formattedText += `Link: ${post.url}\n\n---\n\n`;
      }

      // 处理评论
      const commentsData = response[1].data.children;
      
      if (commentsData.length > 0) {
        formattedText += `## Top Comments\n\n`;
        
        // 递归处理评论
        function formatComments(comments: any[], level: number = 0): string {
          if (level >= comment_depth) return '';
          
          let result = '';
          
          for (const commentObj of comments) {
            if (commentObj.kind !== 't1') continue; // t1是评论类型
            
            const comment = commentObj.data;
            if (!comment) continue;
            
            const commentDate = new Date(comment.created_utc * 1000).toLocaleString();
            const indent = '  '.repeat(level);
            
            result += `${indent}- u/${comment.author} · Score: ${comment.score} · ${commentDate}\n`;
            result += `${indent}  ${comment.body.replace(/\n/g, `\n${indent}  `)}\n\n`;
            
            // 处理回复
            if (comment.replies && 
                comment.replies.data && 
                comment.replies.data.children && 
                comment.replies.data.children.length > 0) {
              result += formatComments(comment.replies.data.children, level + 1);
            }
          }
          
          return result;
        }
        
        formattedText += formatComments(commentsData);
      } else {
        formattedText += `No comments yet.`;
      }

      return {
        content: [
          {
            type: 'text',
            text: formattedText
          }
        ]
      };
    } catch (error) {
      console.error('[ERROR] Failed to get post content:', error);
      return {
        content: [
          {
            type: 'text',
            text: `An error occurred while fetching content for post ${post_id}: ${error}`
          }
        ]
      };
    }
  }
);

/**
 * 工具: 获取帖子评论
 */
server.tool(
  'get_post_comments',
  'Get comments from a post',
  {
    post_id: z.string().describe('ID of the post or full Reddit post URL'),
    limit: z.number().min(1).max(100).default(10).describe('Number of comments to return (default: 10, range: 1-100)')
  },
  async ({ post_id, limit }) => {
    try {
      // 检查post_id是否为URL
      const extractedId = post_id.includes('reddit.com') 
        ? extractPostIdFromUrl(post_id) 
        : post_id;
        
      if (!extractedId) {
        return {
          content: [
            {
              type: 'text',
              text: 'Invalid post ID or URL format.'
            }
          ]
        };
      }

      // 获取帖子评论
      const response = await makeRedditApiRequest<any>(`/comments/${extractedId}`, { 
        limit: limit.toString()
      });
      
      if (!response || !Array.isArray(response) || response.length < 2) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to retrieve comments for post: ${extractedId}`
            }
          ]
        };
      }

      // 帖子基本信息
      const postData = response[0].data.children[0].data;
      const postTitle = postData.title;
      const subreddit = postData.subreddit;
      
      // 评论数据
      const commentsData = response[1].data.children;
      
      let formattedText = `# Comments for "${postTitle}" in r/${subreddit}\n\n`;
      
      if (commentsData.length === 0) {
        formattedText += `No comments found.`;
      } else {
        commentsData.forEach((commentObj: any, index: number) => {
          if (commentObj.kind !== 't1') return; // t1是评论类型
          
          const comment = commentObj.data;
          if (!comment) return;
          
          const commentDate = new Date(comment.created_utc * 1000).toLocaleString();
          
          formattedText += `## Comment #${index + 1}\n`;
          formattedText += `**Author:** u/${comment.author} | **Score:** ${comment.score} | **Date:** ${commentDate}\n\n`;
          formattedText += `${comment.body}\n\n`;
          formattedText += `---\n\n`;
        });
      }

      return {
        content: [
          {
            type: 'text',
            text: formattedText
          }
        ]
      };
    } catch (error) {
      console.error('[ERROR] Failed to get post comments:', error);
      return {
        content: [
          {
            type: 'text',
            text: `An error occurred while fetching comments for post ${post_id}: ${error}`
          }
        ]
      };
    }
  }
);

/**
 * 主函数启动服务器
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('Reddit MCP Server running on stdio');
}

// 启动服务器
main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
}
