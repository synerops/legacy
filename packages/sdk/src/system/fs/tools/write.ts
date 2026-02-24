/**
 * Write file tool
 *
 * Factory function creates a tool bound to a specific Fs instance.
 * Placeholder export provided for backward compatibility.
 */

import { tool } from 'ai'
import { z } from 'zod'
import type { Fs } from '@osprotocol/schema/system/fs'

const inputSchema = z.object({
  path: z.string().describe('Path to the file to write'),
  content: z.string().describe('Content to write'),
})

/**
 * Creates a write tool bound to the provided filesystem.
 *
 * @example
 * ```ts
 * const fs = createDiskFs({ root: '.syner' })
 * const writeTool = createWriteTool(fs)
 *
 * const result = await generateText({
 *   tools: { write: writeTool },
 *   prompt: 'Write "Hello" to /test.md',
 * })
 * ```
 */
export function createWriteTool(fs: Fs) {
  return tool({
    description: 'Write content to a file',
    inputSchema,
    execute: async ({ path, content }) => {
      const entry = await fs.write(path, content)
      return { success: true, path: entry.path, size: entry.size }
    },
  })
}

/**
 * Placeholder write tool.
 *
 * @deprecated Use createWriteTool(fs) instead
 */
export const write = tool({
  description: 'Write content to a file',
  inputSchema,
  execute: async ({ path }) => ({
    success: false,
    error: `Fs not configured. Use createWriteTool(fs). Path: ${path}`,
  }),
})

export default write
