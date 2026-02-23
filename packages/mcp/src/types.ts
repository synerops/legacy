/**
 * MCP Server Types
 */

import type { GitHubClient } from '@syner/github'
import type { Kv } from '@syner/sdk'

export interface SynerMcpServerOptions {
  /** Server name for MCP identification */
  name?: string
  /** Server version */
  version?: string
  /** Pre-configured GitHub client */
  github?: GitHubClient
  /** KV store for caching (optional, uses memory by default) */
  kv?: Kv
}
