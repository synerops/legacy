/**
 * Filesystem tools exports
 *
 * Tools are AI SDK tool definitions that can be used with generateText.
 */

import type { Fs } from '@osprotocol/schema/system/fs'
import { createReadTool, read } from './read'
import { createWriteTool, write } from './write'
import { createListTool, list } from './list'
import { createRemoveTool, remove } from './remove'
import { createExistsTool, exists } from './exists'

/**
 * Creates all filesystem tools bound to a specific Fs instance.
 *
 * @example
 * ```ts
 * import { createSystem, createFsTools } from '@syner/sdk'
 *
 * const system = createSystem()
 * const fsTools = createFsTools(system.fs)
 *
 * const result = await generateText({
 *   model: gateway('anthropic/claude-sonnet-4'),
 *   tools: fsTools,
 *   prompt: 'Read the file at /sessions/auth/context.md',
 * })
 * ```
 */
export function createFsTools(fs: Fs) {
  return {
    read: createReadTool(fs),
    write: createWriteTool(fs),
    list: createListTool(fs),
    remove: createRemoveTool(fs),
    exists: createExistsTool(fs),
  }
}

// Factory exports
export { createReadTool } from './read'
export { createWriteTool } from './write'
export { createListTool } from './list'
export { createRemoveTool } from './remove'
export { createExistsTool } from './exists'

// Placeholder exports (deprecated)
export { read, write, list, remove, exists }
