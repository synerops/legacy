/**
 * getFileContent Tool
 *
 * Read a file from a GitHub repository.
 */

import { tool } from 'ai'
import { z } from 'zod'
import type { Kv } from '@osprotocol/schema/context/kv'
import type { GitHubClient } from '../api/client'
import { getFileContent as getFileContentImpl } from '../api/content'

export interface GetFileContentToolOptions {
  client: GitHubClient
  kv: Kv
}

const inputSchema = z.object({
  owner: z.string().describe('Repository owner (user or organization)'),
  repo: z.string().describe('Repository name'),
  path: z.string().describe('File path within the repository'),
  ref: z.string().optional().describe('Branch, tag, or commit SHA (default: HEAD)'),
})

export function getFileContentTool(options: GetFileContentToolOptions) {
  const { client, kv } = options

  return tool({
    description: 'Read a file from a GitHub repository',
    inputSchema,
    execute: async ({ owner, repo, path, ref }) => {
      const file = await getFileContentImpl({ client, kv, owner, repo, path, ref })
      if (!file) {
        return { found: false, error: 'File not found' }
      }
      return { found: true, content: file.content, path: file.path }
    },
  })
}
