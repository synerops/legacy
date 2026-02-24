/**
 * Exists check tool
 *
 * Factory function creates a tool bound to a specific Fs instance.
 * Placeholder export provided for backward compatibility.
 */

import { tool } from 'ai'
import { z } from 'zod'
import type { Fs } from '@osprotocol/schema/system/fs'

const inputSchema = z.object({
  path: z.string().describe('Path to check'),
})

/**
 * Creates an exists tool bound to the provided filesystem.
 *
 * @example
 * ```ts
 * const fs = createDiskFs({ root: '.syner' })
 * const existsTool = createExistsTool(fs)
 *
 * const result = await generateText({
 *   tools: { exists: existsTool },
 *   prompt: 'Check if /sessions/auth/context.md exists',
 * })
 * ```
 */
export function createExistsTool(fs: Fs) {
  return tool({
    description: 'Check if a file or directory exists',
    inputSchema,
    execute: async ({ path }) => {
      const exists = await fs.exists(path)
      return { success: true, exists, path }
    },
  })
}

/**
 * Placeholder exists tool.
 *
 * @deprecated Use createExistsTool(fs) instead
 */
export const exists = tool({
  description: 'Check if a file or directory exists',
  inputSchema,
  execute: async ({ path }) => ({
    success: false,
    error: `Fs not configured. Use createExistsTool(fs). Path: ${path}`,
  }),
})

export default exists
