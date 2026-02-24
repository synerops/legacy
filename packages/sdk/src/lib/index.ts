/**
 * Core module exports
 */

// Types
export type {
  ToolResult,
  RuntimeConfig,
} from './types'

// Config
export { findProjectRoot } from './config'

// Git
export { findGitRoot } from './git'

// Security
export {
  SecurityError,
  assertWithinScope,
  resolveSafePath,
  resolveRealPath,
  validateImportPath,
  isWithinAllowedPaths,
  assertWithinAllowedPaths,
} from './security'
