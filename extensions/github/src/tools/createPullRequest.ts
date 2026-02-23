/**
 * createPullRequest Tool
 *
 * Create a pull request in a GitHub repository.
 */

import { tool } from 'ai'
import { z } from 'zod'
import type { GitHubClient } from '../api/client'

export interface CreatePullRequestToolOptions {
  client: GitHubClient
}

const inputSchema = z.object({
  owner: z.string().describe('Repository owner (user or organization)'),
  repo: z.string().describe('Repository name'),
  title: z.string().describe('Pull request title'),
  body: z.string().describe('Pull request description (markdown)'),
  head: z.string().describe('Branch with changes'),
  base: z.string().describe('Target branch (e.g., "main")'),
  draft: z.boolean().optional().describe('Create as draft PR'),
})

export function createPullRequestTool(options: CreatePullRequestToolOptions) {
  const { client } = options

  return tool({
    description: 'Create a pull request in a GitHub repository',
    inputSchema,
    execute: async ({ owner, repo, title, body, head, base, draft }) => {
      try {
        const { data } = await client.rest.pulls.create({
          owner,
          repo,
          title,
          body,
          head,
          base,
          draft,
        })

        return {
          number: data.number,
          url: data.html_url,
          state: data.state,
        }
      } catch (error: unknown) {
        if (typeof error === 'object' && error !== null && 'status' in error) {
          if (error.status === 404) {
            return { error: 'Repository not found' }
          }
          if (error.status === 422) {
            return { error: 'Validation failed - branch may not exist or PR already exists' }
          }
          if (error.status === 403) {
            return { error: 'Permission denied - check GitHub App permissions' }
          }
        }
        throw error
      }
    },
  })
}
