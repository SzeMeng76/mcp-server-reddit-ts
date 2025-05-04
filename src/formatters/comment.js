/**
 * 格式化单个评论数据
 * @param {Object} comment - Reddit 评论数据对象
 * @returns {string} 格式化后的评论信息
 */
export function formatCommentData(comment) {
  return `
Comment ID: ${comment.id}
Author: u/${comment.author}
Score: ${comment.score}
Created: ${new Date(comment.created_utc * 1000).toISOString()}
Subreddit: r/${comment.subreddit}
Link ID: ${comment.link_id}
Content: ${comment.body}
  `.trim();
}

/**
 * 格式化多个评论数据
 * @param {Array} comments - Reddit 评论数据数组
 * @returns {string} 格式化后的评论列表信息
 */
export function formatCommentsData(comments) {
  if (!comments || comments.length === 0) {
    return 'No comments found for this submission.';
  }
  
  return comments.map((comment, index) => {
    const c = comment.data;
    return `
Comment ${index + 1}:
Author: u/${c.author}
Score: ${c.score}
Created: ${new Date(c.created_utc * 1000).toISOString()}
ID: ${c.id}
Content: ${c.body}
    `.trim();
  }).join('\n\n');
}
