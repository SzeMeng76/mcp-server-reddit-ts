/**
 * 格式化帖子数据
 * @param {Object} submission - Reddit 帖子数据对象
 * @returns {string} 格式化后的帖子信息
 */
export function formatSubmissionData(submission) {
  return `
Title: ${submission.title}
Posted by: u/${submission.author}
Subreddit: r/${submission.subreddit}
Score: ${submission.score}
Comments: ${submission.num_comments}
Created: ${new Date(submission.created_utc * 1000).toISOString()}
NSFW: ${submission.over_18 ? 'Yes' : 'No'}
URL: https://www.reddit.com${submission.permalink}
Content Type: ${submission.is_self ? 'Text Post' : 'Link Post'}
${submission.is_self ? `Text Content: ${submission.selftext}` : `Link URL: ${submission.url}`}
  `.trim();
}

/**
 * 格式化搜索结果数据
 * @param {Array} posts - Reddit 帖子搜索结果数组
 * @returns {string} 格式化后的搜索结果信息
 */
export function formatSearchResults(posts) {
  if (!posts || posts.length === 0) {
    return 'No posts found matching the search criteria.';
  }
  
  return posts.map((post, index) => {
    const p = post.data;
    return `
${index + 1}. ${p.title}
   Subreddit: r/${p.subreddit}
   Posted by: u/${p.author}
   Score: ${p.score}
   Comments: ${p.num_comments}
   URL: https://www.reddit.com${p.permalink}
   ID: ${p.id}
    `.trim();
  }).join('\n\n');
}
