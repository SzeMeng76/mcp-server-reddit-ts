#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// Reddit API 凭据
const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID;
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET;
const USER_AGENT = 'reddit-mcp:v1.0.0 (by /u/your_username)';

// 创建 MCP 服务器
const server = new McpServer({
    name: 'reddit-mcp',
    version: '1.0.0',
});

// 检查是否提供了 Reddit 凭据
if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET) {
    console.error('错误: 未提供 Reddit 凭据。请设置 REDDIT_CLIENT_ID 和 REDDIT_CLIENT_SECRET 环境变量。');
    process.exit(1);
}

// 获取 Reddit API 访问令牌
let accessToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
    const now = Date.now();
    
    // 如果令牌仍然有效，直接返回
    if (accessToken && tokenExpiry > now) {
        return accessToken;
    }
    
    try {
        const response = await fetch('https://www.reddit.com/api/v1/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64')}`,
                'User-Agent': USER_AGENT
            },
            body: 'grant_type=client_credentials'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP 错误: ${response.status}`);
        }
        
        const data = await response.json();
        accessToken = data.access_token;
        tokenExpiry = now + (data.expires_in * 1000);
        
        return accessToken;
    } catch (error) {
        console.error('获取 Reddit 访问令牌失败:', error);
        throw error;
    }
}

// 用于发送 Reddit API 请求的辅助函数
async function redditApiRequest(endpoint, params = {}) {
    try {
        const token = await getAccessToken();
        let url = `https://oauth.reddit.com${endpoint}`;
        
        // 添加查询参数
        if (Object.keys(params).length > 0) {
            const queryParams = new URLSearchParams();
            for (const [key, value] of Object.entries(params)) {
                queryParams.append(key, value);
            }
            url += `?${queryParams.toString()}`;
        }
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'User-Agent': USER_AGENT
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP 错误: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`发送 Reddit API 请求到 ${endpoint} 失败:`, error);
        throw error;
    }
}

// 定义工具: 获取 Subreddit
server.tool(
    'get_subreddit',
    '按名称获取 subreddit',
    {
        name: z.string().describe('要获取的 subreddit 名称'),
    },
    async ({ name }) => {
        try {
            const subreddit = await redditApiRequest(`/r/${name}/about`);
            
            return {
                content: [
                    {
                        type: 'text',
                        text: formatSubredditData(subreddit.data)
                    }
                ]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `获取 subreddit 失败: ${error.message}`
                    }
                ]
            };
        }
    }
);

// 定义工具: 搜索帖子
server.tool(
    'search_posts',
    '在 subreddit 中搜索帖子',
    {
        subreddit: z.string().describe('要搜索的 subreddit 名称'),
        query: z.string().optional().describe('搜索查询').default(''), // 将query设为可选，并提供默认值
        sort: z.enum(['relevance', 'hot', 'new', 'top', 'comments']).optional().describe('结果排序方式').default('hot'),
        time: z.enum(['all', 'hour', 'day', 'week', 'month', 'year']).optional().describe('搜索时间范围').default('all'),
        limit: z.number().min(1).max(100).optional().describe('返回的最大帖子数量').default(10)
    },
    async ({ subreddit, query = '', sort = 'hot', time = 'all', limit = 10 }) => {
        try {
            // 如果提供了查询，则执行搜索，否则获取热门帖子
            let endpoint;
            let params = {};
            
            if (query && query.trim() !== '') {
                // 有查询词时进行搜索
                endpoint = `/r/${subreddit}/search`;
                params = {
                    q: query,
                    sort,
                    t: time,
                    limit: limit.toString(),
                    restrict_sr: 'true'
                };
            } else {
                // 无查询词时根据sort返回对应的帖子列表
                switch (sort) {
                    case 'hot':
                        endpoint = `/r/${subreddit}/hot`;
                        break;
                    case 'new':
                        endpoint = `/r/${subreddit}/new`;
                        break;
                    case 'top':
                        endpoint = `/r/${subreddit}/top`;
                        params.t = time;
                        break;
                    default:
                        endpoint = `/r/${subreddit}/hot`;
                }
                
                params.limit = limit.toString();
            }
            
            const results = await redditApiRequest(endpoint, params);
            
            return {
                content: [
                    {
                        type: 'text',
                        text: formatSearchResults(results.data.children)
                    }
                ]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `搜索帖子失败: ${error.message}`
                    }
                ]
            };
        }
    }
);

// 定义工具: 获取帖子
server.tool(
    'get_submission',
    '获取帖子',
    {
        id: z.string().describe('要获取的帖子 ID'),
    },
    async ({ id }) => {
        try {
            // 清理ID（如果有前缀）
            const cleanId = id.replace('t3_', '');
            const submission = await redditApiRequest(`/comments/${cleanId}`, {limit: '1'});
            
            return {
                content: [
                    {
                        type: 'text',
                        text: formatSubmissionData(submission[0].data.children[0].data)
                    }
                ]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `获取帖子失败: ${error.message}`
                    }
                ]
            };
        }
    }
);

// 定义工具: 获取评论
server.tool(
    'get_comments_by_submission',
    '获取帖子的评论',
    {
        submission_id: z.string().describe('要获取评论的帖子 ID'),
        sort: z.enum(['confidence', 'top', 'new', 'controversial', 'old', 'random', 'qa', 'live']).optional().describe('评论排序方式'),
        limit: z.number().min(1).max(100).optional().describe('返回的最大评论数量')
    },
    async ({ submission_id, sort = 'confidence', limit = 10 }) => {
        try {
            // 清理ID（如果有前缀）
            const cleanId = submission_id.replace('t3_', '');
            
            const params = {
                sort,
                limit: limit.toString()
            };
            
            const data = await redditApiRequest(`/comments/${cleanId}`, params);
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
            return {
                content: [
                    {
                        type: 'text',
                        text: `获取评论失败: ${error.message}`
                    }
                ]
            };
        }
    }
);

// 定义工具: 获取单条评论
server.tool(
    'get_comment',
    '获取评论',
    {
        id: z.string().describe('要获取的评论 ID'),
    },
    async ({ id }) => {
        try {
            // 清理ID（如果有前缀）
            const cleanId = id.replace('t1_', '');
            const comment = await redditApiRequest(`/api/info`, {id: `t1_${cleanId}`});
            
            if (!comment.data.children || comment.data.children.length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `未找到ID为 ${id} 的评论`
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
            return {
                content: [
                    {
                        type: 'text',
                        text: `获取评论失败: ${error.message}`
                    }
                ]
            };
        }
    }
);

// 定义工具: 搜索 Subreddits
server.tool(
    'search_subreddits',
    '按名称或描述搜索 subreddits',
    {
        query: z.string().describe('搜索查询'),
        limit: z.number().min(1).max(100).optional().describe('返回的最大 subreddit 数量')
    },
    async ({ query, limit = 10 }) => {
        try {
            const params = {
                q: query,
                limit: limit.toString()
            };
            
            const results = await redditApiRequest(`/subreddits/search`, params);
            
            return {
                content: [
                    {
                        type: 'text',
                        text: formatSubredditSearchResults(results.data.children)
                    }
                ]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `搜索 subreddits 失败: ${error.message}`
                    }
                ]
            };
        }
    }
);

// 数据格式化函数

function formatSubredditData(subreddit) {
    return `
Subreddit: r/${subreddit.display_name}
标题: ${subreddit.title}
描述: ${subreddit.public_description || '无描述'}
订阅者: ${subreddit.subscribers.toLocaleString()}
创建时间: ${new Date(subreddit.created_utc * 1000).toISOString()}
NSFW: ${subreddit.over18 ? '是' : '否'}
URL: https://www.reddit.com${subreddit.url}
    `.trim();
}

function formatSearchResults(posts) {
    if (!posts || posts.length === 0) {
        return '未找到符合搜索条件的帖子。';
    }
    
    return posts.map((post, index) => {
        const p = post.data;
        return `
${index + 1}. ${p.title}
   Subreddit: r/${p.subreddit}
   发布者: u/${p.author}
   评分: ${p.score}
   评论数: ${p.num_comments}
   URL: https://www.reddit.com${p.permalink}
   ID: ${p.id}
        `.trim();
    }).join('\n\n');
}

function formatSubmissionData(submission) {
    return `
标题: ${submission.title}
发布者: u/${submission.author}
Subreddit: r/${submission.subreddit}
评分: ${submission.score}
评论数: ${submission.num_comments}
创建时间: ${new Date(submission.created_utc * 1000).toISOString()}
NSFW: ${submission.over_18 ? '是' : '否'}
URL: https://www.reddit.com${submission.permalink}
内容类型: ${submission.is_self ? '文本帖' : '链接帖'}
${submission.is_self ? `文本内容: ${submission.selftext}` : `链接 URL: ${submission.url}`}
    `.trim();
}

function formatCommentsData(comments) {
    if (!comments || comments.length === 0) {
        return '此帖子没有评论。';
    }
    
    return comments.map((comment, index) => {
        const c = comment.data;
        return `
评论 ${index + 1}:
作者: u/${c.author}
评分: ${c.score}
创建时间: ${new Date(c.created_utc * 1000).toISOString()}
ID: ${c.id}
内容: ${c.body}
        `.trim();
    }).join('\n\n');
}

function formatCommentData(comment) {
    return `
评论 ID: ${comment.id}
作者: u/${comment.author}
评分: ${comment.score}
创建时间: ${new Date(comment.created_utc * 1000).toISOString()}
Subreddit: r/${comment.subreddit}
链接 ID: ${comment.link_id}
内容: ${comment.body}
    `.trim();
}

function formatSubredditSearchResults(subreddits) {
    if (!subreddits || subreddits.length === 0) {
        return '未找到符合搜索条件的 subreddits。';
    }
    
    return subreddits.map((subreddit, index) => {
        const s = subreddit.data;
        return `
${index + 1}. r/${s.display_name}
   标题: ${s.title}
   描述: ${s.public_description || '无描述'}
   订阅者: ${s.subscribers.toLocaleString()}
   NSFW: ${s.over18 ? '是' : '否'}
   URL: https://www.reddit.com${s.url}
        `.trim();
    }).join('\n\n');
}

// 主函数
async function main() {
    try {
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.log('Reddit MCP 服务器运行在 stdio 上');
    } catch (error) {
        console.error('启动 MCP 服务器失败:', error);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error('主函数中发生致命错误:', error);
    process.exit(1);
});
