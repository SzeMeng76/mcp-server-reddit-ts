export const endpoints = {
  subreddit: {
    about: (subreddit) => `/r/${subreddit}/about`,
    search: '/subreddits/search',
  },
  post: {
    get: (id) => `/comments/${id}`,
    search: (subreddit) => `/r/${subreddit}/search`,
  },
  comment: {
    get: '/api/info',
  },
};
