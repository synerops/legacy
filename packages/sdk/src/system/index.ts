/**
 * System module
 *
 * The System provides runtime capabilities for agents:
 * - Filesystem (fs)
 * - Environment (env) - future
 * - Registry - future
 */

import type { Fs } from '@osprotocol/schema/system/fs'
import { join } from 'path'
import { createDiskFs, createInMemoryFs } from './fs/drivers'
import { findGitRoot } from '../lib/git'

// Env API
export { type Env } from './env'

// Sandbox API
export type { Sandbox, CreateSandboxOptions } from './env/sandbox'

// Filesystem API
export type { Filesystem, FsStreaming } from './fs/protocol'
export { isStreamable } from './fs/protocol'

// Fs drivers
export { createDiskFs, createInMemoryFs, createMemoryFs } from './fs'

// Fs tools
export { createFsTools } from './fs'

export { env } from './env'

// -----------------------------------------------------------------------------
// System
// -----------------------------------------------------------------------------

export interface System {
  /**
   * Filesystem instance.
   * May be Fs or FsStreaming depending on driver.
   * Use isStreamable(fs) to check for streaming support.
   */
  fs: Fs
  // Future: env, registry, etc.
}

export interface CreateSystemOptions {
  /**
   * Root directory for .syner/
   * Defaults to git root if not provided
   */
  root?: string

  /**
   * Use in-memory fs instead of disk
   * Useful for testing
   */
  inMemory?: boolean
}

/**
 * Creates the Syner system with all capabilities.
 *
 * By default, persists to .syner/ in the git root directory.
 *
 * @example
 * ```ts
 * const system = createSystem()
 * await system.fs.write('/sessions/auth/context.md', content)
 * ```
 *
 * @example Testing with in-memory fs
 * ```ts
 * const system = createSystem({ inMemory: true })
 * ```
 */
export function createSystem(options: CreateSystemOptions = {}): System {
  const { inMemory = false } = options

  // Determine root
  let root: string
  if (options.root) {
    root = options.root
  } else {
    const gitRoot = findGitRoot()
    if (!gitRoot) {
      throw new Error(
        'Could not find git root. Provide root option or run from a git repository.'
      )
    }
    root = join(gitRoot, '.syner')
  }

  // Create fs
  const fs = inMemory ? createInMemoryFs() : createDiskFs({ root })

  return { fs }
}
