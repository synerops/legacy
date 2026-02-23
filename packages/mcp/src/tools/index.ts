/**
 * MCP Tool Registration
 *
 * Registers all available Syner tools on an MCP server.
 */

import type { Server } from '@modelcontextprotocol/sdk/server/index.js'
import type { GitHubClient } from '@syner/github'
import type { Kv } from '@syner/sdk'
import {
  getFileContentTool,
  listDirectoryTool,
  getRepoInfoTool,
  searchCodeTool,
  createPullRequestTool,
} from '@syner/github'
import { createToolRegistry } from './adapter'

export interface RegisterGitHubToolsOptions {
  client: GitHubClient
  kv: Kv
}

/**
 * Registers all GitHub tools on the MCP server.
 */
export async function registerGitHubTools(
  server: Server,
  options: RegisterGitHubToolsOptions
): Promise<void> {
  const { client, kv } = options
  const registry = createToolRegistry()

  // Register all GitHub tools (async for JSON Schema resolution)
  await Promise.all([
    registry.register('github_getFileContent', getFileContentTool({ client, kv })),
    registry.register('github_listDirectory', listDirectoryTool({ client })),
    registry.register('github_getRepoInfo', getRepoInfoTool({ client })),
    registry.register('github_searchCode', searchCodeTool({ client })),
    registry.register('github_createPullRequest', createPullRequestTool({ client })),
  ])

  // Set up MCP handlers
  registry.setupHandlers(server)
}

export { createToolRegistry } from './adapter'
