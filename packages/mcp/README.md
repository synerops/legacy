# @syner/mcp

MCP (Model Context Protocol) server for Syner OS. Exposes Syner tools via MCP for integration with Claude Code and other MCP-compatible clients.

## Installation

```bash
bun add @syner/mcp
```

## Usage

### With Claude Code

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

Environment variables are expanded from your shell environment.

### Programmatic Usage

```typescript
import { createSynerMcpServer, startStdioServer } from '@syner/mcp'
import { createGitHubAppClient } from '@syner/github'

const github = createGitHubAppClient({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_PRIVATE_KEY!,
  installationId: process.env.GITHUB_INSTALLATION_ID!,
})

const server = createSynerMcpServer({ github })
await startStdioServer(server)
```

## Available Tools

| Tool | Description |
|------|-------------|
| `github_getFileContent` | Read a file from a GitHub repository |
| `github_listDirectory` | List files in a repository directory |
| `github_getRepoInfo` | Get repository metadata |
| `github_searchCode` | Search for code in a repository |
| `github_createPullRequest` | Create a pull request |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GITHUB_APP_ID` | GitHub App ID |
| `GITHUB_PRIVATE_KEY` | GitHub App private key (PEM format) |
| `GITHUB_INSTALLATION_ID` | Installation ID for the target org/user |

## License

MIT
