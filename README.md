# 🔴 Reddit MCP Server

**[中文版](./README_ZH.md)** | **English**

> A comprehensive MCP server for accessing Reddit data through the Reddit API

## 🎯 Overview

A Model Context Protocol (MCP) server that provides seamless access to Reddit data including subreddits, posts, comments, and search functionality. Built with TypeScript and the official Reddit API for reliable and fast data retrieval.

## ✨ Features

- 🏠 **Subreddit Information**: Get detailed information about any subreddit
- 🔍 **Post Search**: Search for posts within subreddits with various sorting options
- 📝 **Post Details**: Retrieve complete post information including content and metadata
- 💬 **Comments**: Get comments for posts with different sorting methods
- 🌐 **Subreddit Discovery**: Search and discover new subreddits
- 🔑 **OAuth Authentication**: Secure access using Reddit API credentials
- 🔄 **Auto Token Refresh**: Automatic access token management
- 🎨 **Rich Formatting**: Well-formatted responses with comprehensive data
- ⚡ **High Performance**: Efficient API calls with proper error handling

## 📦 Installation

```bash
npm install reddit-mcp
```

Or use directly with npx:

```bash
npx reddit-mcp
```

## 🔧 Prerequisites

Before using this MCP server, you need to obtain Reddit API credentials:

1. **Create a Reddit App**:
   - Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps)
   - Click "Create App" or "Create Another App"
   - Choose "script" for the app type
   - Note down your `client_id` and `client_secret`

2. **Set Environment Variables**:
   ```bash
   export REDDIT_CLIENT_ID="your_client_id_here"
   export REDDIT_CLIENT_SECRET="your_client_secret_here"
   ```

   Or create a `.env` file:
   ```env
   REDDIT_CLIENT_ID=your_client_id_here
   REDDIT_CLIENT_SECRET=your_client_secret_here
   ```

## 🔧 Configuration

### Claude Desktop

```json
{
  "mcpServers": {
    "reddit": {
      "command": "npx",
      "args": ["reddit-mcp"],
      "env": {
        "REDDIT_CLIENT_ID": "your_client_id_here",
        "REDDIT_CLIENT_SECRET": "your_client_secret_here"
      }
    }
  }
}
```

### Cursor IDE

```json
{
  "mcpServers": {
    "reddit": {
      "command": "npx",
      "args": ["reddit-mcp"],
      "env": {
        "REDDIT_CLIENT_ID": "your_client_id_here",
        "REDDIT_CLIENT_SECRET": "your_client_secret_here"
      }
    }
  }
}
```

### VS Code with GitHub Copilot

```json
{
  "mcp.servers": {
    "reddit": {
      "command": "npx",
      "args": ["reddit-mcp"],
      "transport": "stdio",
      "env": {
        "REDDIT_CLIENT_ID": "your_client_id_here",
        "REDDIT_CLIENT_SECRET": "your_client_secret_here"
      }
    }
  }
}
```

## 🛠️ Available Tools

### `get_subreddit`
Get detailed information about a specific subreddit.

**Parameters:**
- `name` (required): Name of the subreddit to retrieve (without 'r/' prefix)

**Example Usage:**
```
"Get information about the programming subreddit"
"Show me details for the MachineLearning subreddit"
```

**Returns:**
- Subreddit title and description
- Subscriber count
- Creation date
- NSFW status
- URL

### `search_posts`
Search for posts within a subreddit or get trending posts.

**Parameters:**
- `subreddit` (required): Name of the subreddit to search in
- `query` (optional): Search query string (if empty, returns trending posts)
- `sort` (optional): Sort method - "relevance", "hot", "new", "top", "comments" (default: "hot")
- `time` (optional): Time range - "all", "hour", "day", "week", "month", "year" (default: "all")
- `limit` (optional): Maximum number of posts to return (1-100, default: 10)

**Example Usage:**
```
"Search for posts about 'artificial intelligence' in r/MachineLearning"
"Get the top 20 hot posts from r/programming"
"Find new posts about 'React' in r/webdev from the past week"
```

**Returns:**
- Post titles and URLs
- Author information
- Score and comment count
- Post IDs for further queries

### `get_submission`
Get detailed information about a specific post.

**Parameters:**
- `id` (required): Post ID (with or without 't3_' prefix)

**Example Usage:**
```
"Get details for post ID abc123"
"Show me the full content of post t3_xyz789"
```

**Returns:**
- Complete post title and content
- Author and subreddit information
- Score and comment statistics
- Creation time
- Post type (text or link)

### `get_comments_by_submission`
Get comments for a specific post.

**Parameters:**
- `submission_id` (required): ID of the post to get comments for
- `sort` (optional): Comment sort method - "confidence", "top", "new", "controversial", "old", "random", "qa", "live" (default: "confidence")
- `limit` (optional): Maximum number of comments to return (1-100, default: 10)

**Example Usage:**
```
"Get the top 15 comments for post abc123"
"Show me the newest comments for post xyz789"
```

**Returns:**
- Comment content and authors
- Comment scores
- Creation timestamps
- Comment IDs

### `get_comment`
Get detailed information about a specific comment.

**Parameters:**
- `id` (required): Comment ID (with or without 't1_' prefix)

**Example Usage:**
```
"Get details for comment ID def456"
"Show me comment t1_ghi789"
```

**Returns:**
- Comment content and author
- Score and creation time
- Associated subreddit and post
- Comment ID

### `search_subreddits`
Search for subreddits by name or description.

**Parameters:**
- `query` (required): Search query for subreddit names or descriptions
- `limit` (optional): Maximum number of subreddits to return (1-100, default: 10)

**Example Usage:**
```
"Search for subreddits about cooking"
"Find programming-related subreddits"
```

**Returns:**
- Subreddit names and descriptions
- Subscriber counts
- NSFW status
- URLs

## 🎮 Usage Examples

### Content Discovery
```
"Find the most popular posts in r/technology from this week"
"Search for discussions about 'GPT-4' in r/MachineLearning"
```

### Research and Analysis
```
"Get information about r/datascience and show me the top 10 posts"
"Find subreddits related to 'blockchain' and show their subscriber counts"
```

### Comment Analysis
```
"Get the top comments for post abc123 and analyze the sentiment"
"Show me controversial comments from post xyz789"
```

### Trend Monitoring
```
"What are the trending topics in r/programming today?"
"Search for posts about 'ChatGPT' across relevant subreddits"
```

## 🏗️ Development

### Local Setup

```bash
# Clone the repository
git clone https://github.com/SzeMeng76/mcp-server-reddit-ts.git
cd mcp-server-reddit-ts

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Reddit API credentials

# Start the server
npm start
```

### Project Structure

```
mcp-server-reddit-ts/
├── index.js              # Main MCP server implementation
├── package.json          # Dependencies and scripts
├── .env.example          # Environment variables template
└── README.md            # Documentation
```

### Core Dependencies

- **@modelcontextprotocol/sdk**: Official MCP server framework
- **node-fetch**: HTTP client for Reddit API calls
- **dotenv**: Environment variable management
- **zod**: Runtime type validation and schema definition

## 🔧 Technical Details

### Authentication Flow
- Uses OAuth 2.0 client credentials flow
- Automatic token refresh when expired
- Secure credential handling through environment variables

### API Rate Limiting
- Respects Reddit API rate limits
- Implements proper User-Agent headers
- Handles HTTP errors gracefully

### Data Processing
- Comprehensive data formatting for readability
- Proper handling of Reddit's nested comment structure
- Clean ID processing (removes prefixes automatically)

### Error Handling
- Detailed error messages for common issues
- Graceful degradation for API failures
- Proper validation of input parameters

## ⚠️ Important Notes

### Reddit API Guidelines
- Follow Reddit's [API Terms of Service](https://www.redditinc.com/policies/developer-terms)
- Respect rate limits (60 requests per minute for client credentials)
- Use descriptive User-Agent strings
- Do not make excessive requests

### Data Privacy
- This server only accesses public Reddit data
- No user authentication or private data access
- Respects Reddit's privacy settings and deleted content

### Content Guidelines
- Be aware of NSFW content when accessing certain subreddits
- Respect community rules and guidelines
- Use data responsibly for research and analysis

## 🚀 Common Use Cases

### Market Research
- **Trend Analysis**: Monitor discussions about products or topics
- **Sentiment Analysis**: Analyze public opinion on brands or events
- **Community Insights**: Understand audience preferences and behaviors

### Content Strategy
- **Topic Discovery**: Find trending topics in relevant communities
- **Engagement Analysis**: Study what content performs well
- **Community Research**: Identify active communities in your niche

### Academic Research
- **Social Media Studies**: Analyze online community dynamics
- **Public Opinion Research**: Study attitudes and opinions
- **Content Analysis**: Examine communication patterns

### Development and Testing
- **API Integration**: Test Reddit data integration in applications
- **Bot Development**: Prototype Reddit bots and automated tools
- **Data Analysis**: Process Reddit data for insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes with proper error handling
4. Test with various subreddits and content types
5. Ensure environment variables are properly documented
6. Submit a pull request with clear description

### Development Guidelines

- Follow JavaScript/Node.js best practices
- Add proper error handling for new features
- Test with both popular and niche subreddits
- Document any new parameters or return formats
- Respect Reddit API guidelines and rate limits

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## ⚖️ Legal and Ethics

- **Reddit API Compliance**: Strictly follows Reddit's developer terms
- **Public Data Only**: Accesses only publicly available Reddit content
- **Rate Limiting**: Respects API limits to avoid service disruption
- **Content Responsibility**: Users must ensure appropriate use of accessed data
- **Privacy Respect**: No access to private messages or restricted content

## 🙏 Acknowledgments

- **Reddit**: For providing the comprehensive Reddit API
- **MCP Community**: For the standardized protocol
- **Node-fetch maintainers**: For reliable HTTP client functionality
- **Contributors**: Everyone who helps improve this project

---

*Built for Reddit data analysis, content research, and community insights* 🔴📊
