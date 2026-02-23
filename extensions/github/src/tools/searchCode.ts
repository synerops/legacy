/**
 * searchCode Tool
 *
 * Search for code in a GitHub repository.
 */

import { tool } from 'ai'
import { z } from 'zod'
import type { GitHubClient } from '../api/client'

export interface SearchCodeToolOptions {
  client: GitHubClient
}

const inputSchema = z.object({
  query: z.string().describe('Search query (code, filename, etc.)'),
  owner: z.string().describe('Repository owner (user or organization)'),
  repo: z.string().describe('Repository name'),
})

export function searchCodeTool(options: SearchCodeToolOptions) {
  const { client } = options

  return tool({
    description: 'Search for code in a GitHub repository',
    inputSchema,
    execute: async ({ query, owner, repo }) => {
      try {
        const { data } = await client.rest.search.code({
          q: `${query} repo:${owner}/${repo}`,
          per_page: 10,
        })

        return {
          totalCount: data.total_count,
          items: data.items.map((item) => ({
            path: item.path,
            name: item.name,
          })),
        }
      } catch (error: unknown) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'status' in error &&
          error.status === 422
        ) {
          return { error: 'Invalid search query' }
        }
        throw error
      }
    },
  })
}
