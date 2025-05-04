import fetch from 'node-fetch';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

let accessToken = null;
let tokenExpiry = 0;

export async function getAccessToken() {
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
        'Authorization': `Basic ${Buffer.from(`${config.reddit.clientId}:${config.reddit.clientSecret}`).toString('base64')}`,
        'User-Agent': config.reddit.userAgent
      },
      body: 'grant_type=client_credentials'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = now + (data.expires_in * 1000);
    
    logger.debug('New Reddit access token obtained');
    return accessToken;
  } catch (error) {
    logger.error('Failed to get Reddit access token:', error);
    throw error;
  }
}
