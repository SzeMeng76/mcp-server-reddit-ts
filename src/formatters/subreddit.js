/**
 * 格式化 subreddit 数据
 * @param {Object} subreddit - Reddit subreddit 数据对象
 * @returns {string} 格式化后的 subreddit 信息
 */
export function formatSubredditData(subreddit) {
  return `
Subreddit: r/${subreddit.display_name}
Title: ${subreddit.title}
Description: ${subreddit.public_description || 'No description'}
Subscribers: ${subreddit.subscribers.toLocaleString()}
Created: ${new Date(subreddit.created_utc * 1000).toISOString()}
NSFW: ${subreddit.over18 ? 'Yes' : 'No'}
URL: https://www.reddit.com${subreddit.url}
  `.trim();
}

/**
 * 格式化 subreddit 搜索结果
 * @param {Array} subreddits - Reddit subreddit 搜索结果数组
 * @returns {string} 格式化后的搜索结果信息
 */
export function formatSubredditSearchResults(subreddits) {
  if (!subreddits || subreddits.length === 0) {
    return 'No subreddits found matching the search criteria.';
  }
  
  return subreddits.map((subreddit, index) => {
    const s = subreddit.data;
    return `
${index + 1}. r/${s.display_name}
   Title: ${s.title}
   Description: ${s.public_description || 'No description'}
   Subscribers: ${s.subscribers.toLocaleString()}
   NSFW: ${s.over18 ? 'Yes' : 'No'}
   URL: https://www.reddit.com${s.url}
    `.trim();
  }).join('\n\n');
}
