/**
 * listDirectory Tool
 *
 * List files and folders in a GitHub repository directory.
 */

import { tool } from 'ai'
import { z } from 'zod'
import type { GitHubClient } from '../api/client'

export interface ListDirectoryToolOptions {
  client: GitHubClient
}

const inputSchema = z.object({
  owner: z.string().describe('Repository owner (user or organization)'),
  repo: z.string().describe('Repository name'),
  path: z.string().optional().describe('Directory path (empty or omit for root)'),
  ref: z.string().optional().describe('Branch, tag, or commit SHA (default: HEAD)'),
})

export function listDirectoryTool(options: ListDirectoryToolOptions) {
  const { client } = options

  return tool({
    description: 'List files and folders in a GitHub repository directory',
    inputSchema,
    execute: async ({ owner, repo, path = '', ref }) => {
      try {
        const { data } = await client.rest.repos.getContent({
          owner,
          repo,
          path,
          ref,
        })

        if (!Array.isArray(data)) {
          return { error: 'Not a directory' }
        }

        return {
          items: data.map((item) => ({
            name: item.name,
            type: item.type, // 'file' | 'dir' | 'submodule' | 'symlink'
            path: item.path,
          })),
        }
      } catch (error: unknown) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'status' in error &&
          error.status === 404
        ) {
          return { error: 'Directory not found' }
        }
        throw error
      }
    },
  })
}
