/**
 * @syner/github - GitHub OAuth and API Integration
 *
 * Extends Syner OS with GitHub integration capabilities:
 * - OAuth authentication flow
 * - API client with rate limit handling
 * - ETag-based cache layer for rate limit optimization
 */

// OAuth
export {
  createAuthorizationUrl,
  exchangeCodeForToken,
  decodeState,
  generateNonce,
  resolveOrigin,
  isValidOriginKey,
  getOriginKeys,
  type OriginKey,
  type GitHubOAuthConfig,
  type GitHubOAuthState,
  type GitHubOAuthTokens,
  type GitHubTokenResponse,
  type GitHubUser,
} from './oauth'

// API
export {
  createGitHubClient,
  createGitHubClientFromTokens,
  createGitHubAppClient,
  getAuthenticatedUser,
  getFileContent,
  type GitHubClient,
  type GitHubClientOptions,
  type GitHubAppClientOptions,
  type FileContent,
  type GetFileContentOptions,
} from './api'

// Cache
export {
  contentCacheKey,
  repoCacheKey,
  repoInvalidationPattern,
  getCachedContent,
  createConditionalHeaders,
  extractCacheHeaders,
  type CachedFetchOptions,
  type CachedFetchResult,
} from './cache'

// Tools
export {
  getFileContentTool,
  listDirectoryTool,
  getRepoInfoTool,
  searchCodeTool,
  type GetFileContentToolOptions,
  type ListDirectoryToolOptions,
  type GetRepoInfoToolOptions,
  type SearchCodeToolOptions,
} from './tools'
