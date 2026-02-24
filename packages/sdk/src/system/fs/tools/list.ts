/**
 * List directory tool
 *
 * Factory function creates a tool bound to a specific Fs instance.
 * Placeholder export provided for backward compatibility.
 */

import { tool } from 'ai'
import { z } from 'zod'
import type { Fs } from '@osprotocol/schema/system/fs'

const inputSchema = z.object({
  path: z.string().describe('Path to the directory to list'),
})

/**
 * Creates a list tool bound to the provided filesystem.
 *
 * @example
 * ```ts
 * const fs = createDiskFs({ root: '.syner' })
 * const listTool = createListTool(fs)
 *
 * const result = await generateText({
 *   tools: { list: listTool },
 *   prompt: 'List files in /sessions',
 * })
 * ```
 */
export function createListTool(fs: Fs) {
  return tool({
    description: 'List contents of a directory',
    inputSchema,
    execute: async ({ path }) => {
      const entries = await fs.list(path)
      return { success: true, entries }
    },
  })
}

/**
 * Placeholder list tool.
 *
 * @deprecated Use createListTool(fs) instead
 */
export const list = tool({
  description: 'List contents of a directory',
  inputSchema,
  execute: async ({ path }) => ({
    success: false,
    error: `Fs not configured. Use createListTool(fs). Path: ${path}`,
  }),
})

export default list
