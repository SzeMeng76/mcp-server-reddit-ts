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
