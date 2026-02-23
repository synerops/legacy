/**
 * @syner/mcp - MCP Server for Syner Tools
 *
 * Exposes Syner tools (GitHub, etc.) via Model Context Protocol
 * for integration with Claude Code and other MCP clients.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createGitHubAppClient, type GitHubClient } from '@syner/github'
import { createMemoryKv } from '@syner/sdk'
import { registerGitHubTools } from './tools'
import type { SynerMcpServerOptions } from './types'

export type { SynerMcpServerOptions }

/**
 * Creates and configures a Syner MCP server.
 *
 * @example
 * ```ts
 * import { createSynerMcpServer } from '@syner/mcp'
 * import { createGitHubAppClient } from '@syner/github'
 *
 * const github = createGitHubAppClient({
 *   appId: process.env.GITHUB_APP_ID!,
 *   privateKey: process.env.GITHUB_PRIVATE_KEY!,
 *   installationId: process.env.GITHUB_INSTALLATION_ID!,
 * })
 *
 * const server = createSynerMcpServer({ github })
 * ```
 */
export async function createSynerMcpServer(options: SynerMcpServerOptions = {}) {
  const { name = 'syner', version = '1.0.0', github, kv = createMemoryKv() } = options

  const server = new Server(
    { name, version },
    { capabilities: { tools: {} } }
  )

  // Register GitHub tools if client provided
  if (github) {
    await registerGitHubTools(server, { client: github, kv })
  }

  return server
}

/**
 * Creates a GitHub client from environment variables.
 *
 * Required env vars:
 * - GITHUB_APP_ID
 * - GITHUB_PRIVATE_KEY
 * - GITHUB_INSTALLATION_ID
 */
export function createGitHubClientFromEnv(): GitHubClient {
  const appId = process.env.GITHUB_APP_ID
  const privateKey = process.env.GITHUB_PRIVATE_KEY
  const installationId = process.env.GITHUB_INSTALLATION_ID

  if (!appId || !privateKey || !installationId) {
    throw new Error(
      'Missing required environment variables: GITHUB_APP_ID, GITHUB_PRIVATE_KEY, GITHUB_INSTALLATION_ID'
    )
  }

  return createGitHubAppClient({ appId, privateKey, installationId })
}

/**
 * Starts the MCP server with stdio transport.
 */
export async function startStdioServer(server: Server): Promise<void> {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

// Re-export types and utilities
export { registerGitHubTools, createToolRegistry } from './tools'
