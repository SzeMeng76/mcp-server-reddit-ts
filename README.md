# Reddit MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for browsing, searching, and reading Reddit content. This implementation is fully written in JavaScript/Node.js, making it easy to use with `npx`.

## Features

- Browse subreddits, posts, and comments
- Search for content across Reddit
- No Reddit account required for read-only access
- Robust input validation with Zod

## Prerequisites

Before you begin, ensure you have the following:

- Node.js 18 or higher
- A Reddit API client ID and client secret

### Creating a Reddit API Application

1. Go to [Reddit's App Preferences](https://www.reddit.com/prefs/apps)
2. Click "Create App" or "Create Another App" at the bottom
3. Fill in the form:
   - Name: Choose any name (e.g., "MCP Client")
   - App type: Select "script"
   - Description: Optional
   - About URL: Optional
   - Redirect URI: Use `http://localhost:8080`
4. Click "Create app"
5. Note your `client_id` (the string under the app name) and `client_secret`

## Usage

You can use this package with npx without installing it globally:

```bash
# Set environment variables
export REDDIT_CLIENT_ID=your_client_id
export REDDIT_CLIENT_SECRET=your_client_secret

# Run the MCP server
npx reddit-mcp
```

Alternatively, you can create a `.env` file in the current directory:

```
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
```

Then run:

```bash
npx reddit-mcp
```

## Using with Claude Desktop

To use this server with Claude Desktop:

1. Follow the instructions [here](https://modelcontextprotocol.io/quickstart/user) to open your Claude Desktop configuration file.

2. Add the following to the file:

```json
"mcpServers": {
  "reddit": {
    "command": "npx",
    "args": ["reddit-mcp"],
    "env": {
      "REDDIT_CLIENT_ID": "your_client_id",
      "REDDIT_CLIENT_SECRET": "your_client_secret"
    }
  }
}
```

3. Restart Claude Desktop.

## Available Tools

The server exposes the following tools:

| Name | Description |
|------|-------------|
| get_comment | Access a comment |
| get_comments_by_submission | Access comments of a submission |
| get_submission | Access a submission |
| get_subreddit | Access a subreddit by name |
| search_posts | Search posts in a subreddit |
| search_subreddits | Search subreddits by name or description |

## License

This package is MIT licensed.

## Development

If you want to modify or extend this MCP server:

1. Clone the repository
2. Install dependencies: `npm install`
3. Make your changes
4. Test locally: `npm start`
5. Publish to npm (if applicable)
