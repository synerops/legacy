#!/usr/bin/env bun
/**
 * Syner MCP Server
 *
 * Standalone server script for Claude Code integration.
 *
 * Usage in .mcp.json:
 * {
 *   "mcpServers": {
 *     "syner": {
 *       "command": "bun",
 *       "args": ["run", "packages/mcp/src/server.ts"],
 *       "env": {
 *         "GITHUB_APP_ID": "${GITHUB_APP_ID}",
 *         "GITHUB_PRIVATE_KEY": "${GITHUB_PRIVATE_KEY}",
 *         "GITHUB_INSTALLATION_ID": "${GITHUB_INSTALLATION_ID}"
 *       }
 *     }
 *   }
 * }
 */

import { createSynerMcpServer, createGitHubClientFromEnv, startStdioServer } from './index'

async function main() {
  // Create GitHub client from environment
  const github = createGitHubClientFromEnv()

  // Create and configure server
  const server = await createSynerMcpServer({
    name: 'syner',
    version: '0.1.0',
    github,
  })

  // Start with stdio transport
  await startStdioServer(server)
}

main().catch((error) => {
  console.error('Failed to start Syner MCP server:', error)
  process.exit(1)
})
