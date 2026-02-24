/**
 * Remove file/directory tool
 *
 * Factory function creates a tool bound to a specific Fs instance.
 * Placeholder export provided for backward compatibility.
 */

import { tool } from 'ai'
import { z } from 'zod'
import type { Fs } from '@osprotocol/schema/system/fs'

const inputSchema = z.object({
  path: z.string().describe('Path to the file or directory to remove'),
})

/**
 * Creates a remove tool bound to the provided filesystem.
 *
 * @example
 * ```ts
 * const fs = createDiskFs({ root: '.syner' })
 * const removeTool = createRemoveTool(fs)
 *
 * const result = await generateText({
 *   tools: { remove: removeTool },
 *   prompt: 'Delete /sessions/old-session',
 * })
 * ```
 */
export function createRemoveTool(fs: Fs) {
  return tool({
    description: 'Remove a file or directory',
    inputSchema,
    execute: async ({ path }) => {
      const removed = await fs.remove(path)
      if (!removed) {
        return { success: false, error: `Path not found: ${path}` }
      }
      return { success: true, path }
    },
  })
}

/**
 * Placeholder remove tool.
 *
 * @deprecated Use createRemoveTool(fs) instead
 */
export const remove = tool({
  description: 'Remove a file or directory',
  inputSchema,
  execute: async ({ path }) => ({
    success: false,
    error: `Fs not configured. Use createRemoveTool(fs). Path: ${path}`,
  }),
})

export default remove
