/**
 * GitHub App Client
 *
 * Server-to-server authentication using GitHub App credentials.
 * Uses @octokit/auth-app for installation-based auth.
 */

import { Octokit } from 'octokit'
import { createAppAuth } from '@octokit/auth-app'
import { throttling } from '@octokit/plugin-throttling'
import type { GitHubClient } from './client'

// Create throttled Octokit class
const ThrottledOctokit = Octokit.plugin(throttling)

export interface GitHubAppClientOptions {
  appId: string
  privateKey: string
  installationId: string | number
  /** Callback when rate limit is hit */
  onRateLimit?: (retryAfter: number, retryCount: number) => void
  /** Callback when secondary rate limit is hit */
  onSecondaryRateLimit?: (retryAfter: number) => void
}

/**
 * Creates an authenticated Octokit instance using GitHub App credentials.
 *
 * Uses installation-based authentication for server-to-server access.
 * This provides higher rate limits (5000 req/hour per installation)
 * and doesn't require user OAuth tokens.
 *
 * @param options - App credentials and installation ID
 * @returns Configured Octokit instance with rate limit handling
 *
 * @example
 * ```ts
 * const client = createGitHubAppClient({
 *   appId: process.env.GITHUB_APP_ID!,
 *   privateKey: process.env.GITHUB_PRIVATE_KEY!,
 *   installationId: process.env.GITHUB_INSTALLATION_ID!,
 * })
 *
 * // Now you can make API calls as the app
 * const { data } = await client.rest.repos.get({
 *   owner: 'synerops',
 *   repo: 'syner',
 * })
 * ```
 */
export function createGitHubAppClient(options: GitHubAppClientOptions): GitHubClient {
  const { appId, privateKey, installationId, onRateLimit, onSecondaryRateLimit } = options

  return new ThrottledOctokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      privateKey,
      installationId,
    },
    throttle: {
      onRateLimit: (retryAfter, opts, octokit, retryCount) => {
        onRateLimit?.(retryAfter, retryCount)
        octokit.log.warn(
          `Rate limit hit for ${opts.method} ${opts.url}, retry #${retryCount + 1} after ${retryAfter}s`
        )
        // Retry up to 2 times
        return retryCount < 2
      },
      onSecondaryRateLimit: (retryAfter, opts, octokit) => {
        onSecondaryRateLimit?.(retryAfter)
        octokit.log.warn(
          `Secondary rate limit for ${opts.method} ${opts.url}, retry after ${retryAfter}s`
        )
        return true
      },
    },
  }) as GitHubClient
}
