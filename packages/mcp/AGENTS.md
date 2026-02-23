# @syner/mcp

MCP server exposing Syner tools for Claude Code integration.

## Quick Start

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "syner": {
      "command": "bun",
      "args": ["run", "packages/mcp/src/server.ts"],
      "env": {
        "GITHUB_APP_ID": "${GITHUB_APP_ID}",
        "GITHUB_PRIVATE_KEY": "${GITHUB_PRIVATE_KEY}",
        "GITHUB_INSTALLATION_ID": "${GITHUB_INSTALLATION_ID}"
      }
    }
  }
}
```

## Available Tools

| Tool | Description |
|------|-------------|
| `github_getFileContent` | Read file from GitHub repo |
| `github_listDirectory` | List directory contents |
| `github_getRepoInfo` | Get repository metadata |
| `github_searchCode` | Search code in repository |
| `github_createPullRequest` | Create pull request |

## Environment Variables

Required for GitHub App authentication:

| Variable | Description |
|----------|-------------|
| `GITHUB_APP_ID` | GitHub App ID |
| `GITHUB_PRIVATE_KEY` | GitHub App private key (PEM) |
| `GITHUB_INSTALLATION_ID` | Installation ID for org/user |

## Key Files

| File | Purpose |
|------|---------|
| `src/server.ts` | Executable MCP server |
| `src/index.ts` | Factory function and exports |
| `src/tools/adapter.ts` | AI SDK to MCP tool conversion |
| `src/tools/index.ts` | Tool registration |
