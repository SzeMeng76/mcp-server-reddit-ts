import fetch from 'node-fetch';
import { getAccessToken } from './auth.js';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

export async function redditApiRequest(endpoint, params = {}) {
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
    
    logger.debug(`Making request to ${endpoint}`);
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': config.reddit.userAgent
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    logger.error(`Failed to make Reddit API request to ${endpoint}:`, error);
    throw error;
  }
}
