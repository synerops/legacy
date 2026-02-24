/**
 * Read file tool
 *
 * Factory function creates a tool bound to a specific Fs instance.
 * Placeholder export provided for backward compatibility.
 */

import { tool } from 'ai'
import { z } from 'zod'
import type { Fs } from '@osprotocol/schema/system/fs'

const inputSchema = z.object({
  path: z.string().describe('Path to the file to read'),
})

/**
 * Creates a read tool bound to the provided filesystem.
 *
 * @example
 * ```ts
 * const fs = createDiskFs({ root: '.syner' })
 * const readTool = createReadTool(fs)
 *
 * const result = await generateText({
 *   tools: { read: readTool },
 *   prompt: 'Read /sessions/auth/context.md',
 * })
 * ```
 */
export function createReadTool(fs: Fs) {
  return tool({
    description: 'Read file contents from the filesystem',
    inputSchema,
    execute: async ({ path }) => {
      const content = await fs.read(path)
      if (content === null) {
        return { success: false, error: `File not found: ${path}` }
      }
      return { success: true, content }
    },
  })
}

/**
 * Placeholder read tool.
 *
 * @deprecated Use createReadTool(fs) instead
 */
export const read = tool({
  description: 'Read file contents from the filesystem',
  inputSchema,
  execute: async ({ path }) => ({
    success: false,
    error: `Fs not configured. Use createReadTool(fs). Path: ${path}`,
  }),
})

export default read
